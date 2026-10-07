// Usage (from the project root, needs Node 18+ and Python 3 with Pillow):
//   node scripts/optimize-car-model.mjs path/to/mercedes_e_class_w212.glb public/models/mercedes-e-class.glb
// Optional third argument: triangle ratio (1 = keep all triangles; lower values
// simplify meshes but visibly ripple the reflections on the body panels).
//
// Rebuilds the Mercedes GLB for the web:
//  - keeps the node hierarchy and the "model_open_all" door clip intact
//  - drops unused attributes (TEXCOORD_1 is never referenced, TANGENT is optional in three.js)
//  - simplifies dense meshes and compresses geometry with EXT_meshopt_compression
//  - downsizes textures and re-encodes them as WebP (EXT_texture_webp)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const NM = process.env.NM ?? path.resolve("node_modules");
const { MeshoptEncoder } = await import(
  pathToFileURL(path.join(NM, "meshoptimizer/meshopt_encoder.module.js")).href
);
const { MeshoptSimplifier } = await import(
  pathToFileURL(path.join(NM, "meshoptimizer/meshopt_simplifier.module.js")).href
);
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const [, , SRC, DST, RATIO_ARG] = process.argv;
const SIMPLIFY_RATIO = Number(RATIO_ARG ?? 1);
const KEEP_ANIMATIONS = new Set(["model_open_all"]);

// ---------- read GLB ----------
const file = fs.readFileSync(SRC);
const jsonLen = file.readUInt32LE(12);
const gltf = JSON.parse(file.subarray(20, 20 + jsonLen).toString("utf8"));
const binStart = 20 + jsonLen + 8;
const bin = file.subarray(binStart, binStart + file.readUInt32LE(20 + jsonLen));

const COMP = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

function readAccessor(i) {
  const a = gltf.accessors[i];
  const bv = gltf.bufferViews[a.bufferView];
  const T = COMP[a.componentType];
  const n = NCOMP[a.type];
  const elemBytes = T.BYTES_PER_ELEMENT * n;
  const stride = bv.byteStride || elemBytes;
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new T(a.count * n);
  const dv = new DataView(bin.buffer, bin.byteOffset);
  for (let e = 0; e < a.count; e++) {
    const src = base + e * stride;
    const slice = new T(bin.buffer.slice(bin.byteOffset + src, bin.byteOffset + src + elemBytes));
    out.set(slice, e * n);
  }
  void dv;
  return out;
}

// ---------- output builders ----------
const chunks = [];
let binLength = 0;
let fallbackLength = 0;
const bufferViews = [];
const accessors = [];

function pushBytes(bytes) {
  const pad = (4 - (binLength % 4)) % 4;
  if (pad) {
    chunks.push(Buffer.alloc(pad));
    binLength += pad;
  }
  const offset = binLength;
  chunks.push(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
  binLength += bytes.byteLength;
  return offset;
}

function addCompressedView(raw, count, stride, mode, filter, target) {
  const encoded = MeshoptEncoder.encodeGltfBuffer(raw, count, stride, mode);
  const offset = pushBytes(encoded);
  const fbOffset = fallbackLength;
  fallbackLength += Math.ceil(raw.byteLength / 4) * 4;
  const view = {
    buffer: 1,
    byteOffset: fbOffset,
    byteLength: raw.byteLength,
    extensions: {
      EXT_meshopt_compression: {
        buffer: 0,
        byteOffset: offset,
        byteLength: encoded.byteLength,
        byteStride: stride,
        count,
        mode,
        ...(filter ? { filter } : {}),
      },
    },
  };
  if (mode === "ATTRIBUTES") {
    view.byteStride = stride;
    view.target = 34962;
  } else view.target = 34963;
  if (target === "none") delete view.target;
  bufferViews.push(view);
  return bufferViews.length - 1;
}

function addAccessor(a) {
  accessors.push(a);
  return accessors.length - 1;
}

// ---------- geometry ----------
let trisBefore = 0,
  trisAfter = 0;
const primCache = new Map();

for (const mesh of gltf.meshes) {
  for (const prim of mesh.primitives) {
    const key = JSON.stringify([
      prim.attributes.POSITION,
      prim.attributes.NORMAL,
      prim.attributes.TEXCOORD_0,
      prim.indices,
    ]);
    if (primCache.has(key)) {
      Object.assign(prim, primCache.get(key));
      continue;
    }

    const pos = readAccessor(prim.attributes.POSITION);
    const nrm = prim.attributes.NORMAL !== undefined ? readAccessor(prim.attributes.NORMAL) : null;
    const uv =
      prim.attributes.TEXCOORD_0 !== undefined ? readAccessor(prim.attributes.TEXCOORD_0) : null;
    const vcount = pos.length / 3;
    let idx =
      prim.indices !== undefined
        ? Uint32Array.from(readAccessor(prim.indices))
        : Uint32Array.from({ length: vcount }, (_, i) => i);

    trisBefore += idx.length / 3;
    const tris = idx.length / 3;
    if (SIMPLIFY_RATIO < 1 && tris > 2000) {
      const target = Math.floor((idx.length * SIMPLIFY_RATIO) / 3) * 3;
      const [simplified] = MeshoptSimplifier.simplify(idx, pos, 3, target, 0.0025, ["LockBorder"]);
      if (simplified.length >= 3) idx = simplified;
    }
    trisAfter += idx.length / 3;

    // Remove unused vertices and order them for cache/fetch locality.
    const [remap, unique] = MeshoptEncoder.reorderMesh(idx, true, false);
    const newPos = new Float32Array(unique * 3);
    const newNrm = nrm ? new Float32Array(unique * 4) : null;
    const newUv = uv ? new Float32Array(unique * 2) : null;
    for (let v = 0; v < vcount; v++) {
      const r = remap[v];
      if (r === 0xffffffff) continue;
      newPos.set(pos.subarray(v * 3, v * 3 + 3), r * 3);
      if (nrm) {
        let x = nrm[v * 3],
          y = nrm[v * 3 + 1],
          z = nrm[v * 3 + 2];
        const l = Math.hypot(x, y, z) || 1;
        newNrm.set([x / l, y / l, z / l, 0], r * 4);
      }
      if (uv) newUv.set(uv.subarray(v * 2, v * 2 + 2), r * 2);
    }

    const min = [Infinity, Infinity, Infinity],
      max = [-Infinity, -Infinity, -Infinity];
    for (let v = 0; v < unique; v++)
      for (let c = 0; c < 3; c++) {
        const x = newPos[v * 3 + c];
        if (x < min[c]) min[c] = x;
        if (x > max[c]) max[c] = x;
      }

    const attributes = {};
    const posBytes = MeshoptEncoder.encodeFilterExp(newPos, unique, 12, 15, "SharedVector");
    attributes.POSITION = addAccessor({
      bufferView: addCompressedView(posBytes, unique, 12, "ATTRIBUTES", "EXPONENTIAL"),
      componentType: 5126,
      count: unique,
      type: "VEC3",
      min,
      max,
    });
    if (newNrm) {
      const nBytes = MeshoptEncoder.encodeFilterOct(newNrm, unique, 4, 8);
      attributes.NORMAL = addAccessor({
        bufferView: addCompressedView(nBytes, unique, 4, "ATTRIBUTES", "OCTAHEDRAL"),
        componentType: 5120,
        normalized: true,
        count: unique,
        type: "VEC3",
      });
    }
    if (newUv) {
      const uBytes = MeshoptEncoder.encodeFilterExp(newUv, unique, 8, 12, "Separate");
      attributes.TEXCOORD_0 = addAccessor({
        bufferView: addCompressedView(uBytes, unique, 8, "ATTRIBUTES", "EXPONENTIAL"),
        componentType: 5126,
        count: unique,
        type: "VEC2",
      });
    }

    const use16 = unique < 65536;
    const iArr = use16 ? Uint16Array.from(idx) : idx;
    const iBytes = new Uint8Array(iArr.buffer, iArr.byteOffset, iArr.byteLength);
    const indices = addAccessor({
      bufferView: addCompressedView(iBytes, idx.length, use16 ? 2 : 4, "TRIANGLES"),
      componentType: use16 ? 5123 : 5125,
      count: idx.length,
      type: "SCALAR",
    });

    const result = { attributes, indices };
    primCache.set(key, result);
    prim.attributes = attributes;
    prim.indices = indices;
    delete prim.targets;
  }
}

// ---------- animations (uncompressed, tiny) ----------
function addRawAccessor(i) {
  const a = gltf.accessors[i];
  const data = readAccessor(i);
  const offset = pushBytes(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: data.byteLength });
  const out = {
    bufferView: bufferViews.length - 1,
    componentType: a.componentType,
    count: a.count,
    type: a.type,
  };
  if (a.min) out.min = a.min;
  if (a.max) out.max = a.max;
  if (a.normalized) out.normalized = true;
  return addAccessor(out);
}
gltf.animations = (gltf.animations || []).filter((a) => KEEP_ANIMATIONS.has(a.name));
for (const anim of gltf.animations) {
  for (const s of anim.samplers) {
    s.input = addRawAccessor(s.input);
    s.output = addRawAccessor(s.output);
  }
}

// ---------- textures ----------
const texRole = new Map(); // image index -> {size, q}
const INTERIOR = new Set([
  "mat_leather",
  "mat_inside_panel",
  "mat_salon",
  "mat_inside_gauges",
  "mat_brakes",
]);
const HIDDEN = new Set(["mat_bottom"]);
function setRole(texInfo, matName, slot) {
  if (!texInfo) return;
  const img = gltf.textures[texInfo.index].source;
  let size = 1024,
    q = 80;
  if (slot === "normal") {
    size = 512;
    q = 88;
  }
  if (slot === "mr" || slot === "ao") size = matName === "mat_body" ? 1024 : 512;
  if (INTERIOR.has(matName)) size = slot === "base" ? 512 : 256;
  if (HIDDEN.has(matName)) size = 256;
  const prev = texRole.get(img);
  if (!prev || prev.size < size) texRole.set(img, { size, q });
}
for (const m of gltf.materials) {
  const p = m.pbrMetallicRoughness || {};
  setRole(p.baseColorTexture, m.name, "base");
  setRole(p.metallicRoughnessTexture, m.name, "mr");
  setRole(m.normalTexture, m.name, "normal");
  setRole(m.occlusionTexture, m.name, "ao");
  setRole(m.emissiveTexture, m.name, "base");
  const t = m.extensions?.KHR_materials_transmission?.transmissionTexture;
  setRole(t, m.name, "mr");
  const cc = m.extensions?.KHR_materials_clearcoat;
  if (cc) {
    setRole(cc.clearcoatTexture, m.name, "mr");
    setRole(cc.clearcoatNormalTexture, m.name, "normal");
  }
}

const work = fs.mkdtempSync("/tmp/tex-");
const spec = [];
gltf.images.forEach((im, i) => {
  const bv = gltf.bufferViews[im.bufferView];
  const data = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
  const src = path.join(work, `in-${i}`);
  fs.writeFileSync(src, data);
  const role = texRole.get(i) || { size: 512, q: 80 };
  spec.push({ src, dst: path.join(work, `out-${i}.webp`), size: role.size, q: role.q });
});
fs.writeFileSync(path.join(work, "spec.json"), JSON.stringify(spec));
execFileSync(
  "python3",
  [
    path.join(path.dirname(fileURLToPath(import.meta.url)), "optimize-car-textures.py"),
    path.join(work, "spec.json"),
    path.join(work, "result.json"),
  ],
  { stdio: "inherit" },
);

let texBytes = 0;
gltf.images = gltf.images.map((im, i) => {
  const bytes = fs.readFileSync(spec[i].dst);
  texBytes += bytes.byteLength;
  const offset = pushBytes(new Uint8Array(bytes));
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.byteLength });
  return {
    bufferView: bufferViews.length - 1,
    mimeType: "image/webp",
    ...(im.name ? { name: im.name } : {}),
  };
});
gltf.textures = gltf.textures.map((t) => {
  const { source, ...rest } = t;
  return { ...rest, extensions: { EXT_texture_webp: { source } } };
});

// ---------- assemble ----------
gltf.accessors = accessors;
gltf.bufferViews = bufferViews;
const total = Math.ceil(binLength / 4) * 4;
gltf.buffers = [
  { byteLength: total },
  { byteLength: fallbackLength, extensions: { EXT_meshopt_compression: { fallback: true } } },
];
const used = new Set([
  ...(gltf.extensionsUsed || []),
  "EXT_meshopt_compression",
  "EXT_texture_webp",
  "KHR_mesh_quantization",
]);
gltf.extensionsUsed = [...used];
gltf.extensionsRequired = ["EXT_meshopt_compression", "EXT_texture_webp", "KHR_mesh_quantization"];
gltf.asset = { ...gltf.asset, generator: "marios-garage optimizer (meshoptimizer)" };

const jsonBuf = Buffer.from(JSON.stringify(gltf));
const jsonPadded = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)]);
const binBuf = Buffer.concat([...chunks, Buffer.alloc(total - binLength)]);
const header = Buffer.alloc(12);
header.write("glTF", 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binBuf.length, 8);
const jh = Buffer.alloc(8);
jh.writeUInt32LE(jsonPadded.length, 0);
jh.write("JSON", 4);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(binBuf.length, 0);
bh.write("BIN\0", 4);
fs.writeFileSync(DST, Buffer.concat([header, jh, jsonPadded, bh, binBuf]));

console.log(
  JSON.stringify({
    trisBefore,
    trisAfter,
    textureMB: +(texBytes / 1e6).toFixed(2),
    geometryMB: +((binLength - texBytes) / 1e6).toFixed(2),
    totalMB: +(fs.statSync(DST).size / 1e6).toFixed(2),
  }),
);
