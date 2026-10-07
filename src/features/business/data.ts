/**
 * Single source of truth for all Marios Garage business content.
 * Contact details, address, opening hours and rating come from the
 * garage's Google listing (see GOOGLE_LISTING_URL).
 */

import garage1 from "@/assets/garage-1.jpg";
import garage2 from "@/assets/garage-2.jpg";
import garage3 from "@/assets/garage-3.jpg";
import garage4 from "@/assets/garage-4.jpg";

export const GOOGLE_LISTING_URL = "https://share.google/tJWhzPzIYgZZ4p0SW";

export interface OpeningHour {
  day: string;
  hours: string;
  /** Opening and closing time in minutes after midnight (Cyprus time). Omitted when closed. */
  opens?: number;
  closes?: number;
  closed?: boolean;
}

export const business = {
  name: "Marios Garage",
  tagline: "Expert care for everyday maintenance and complex engine problems.",
  category: "Car repair and maintenance service",
  area: "Agia Varvara, Paphos, Cyprus",
  address: "QF2V+RH, Paphos, Pafos 8501, Cyprus",
  phoneDisplay: "+357 96 344401",
  phoneHref: "tel:+35796344401",
  plusCode: "QF2V+RH Paphos",
  mapsEmbedUrl: "https://www.google.com/maps?q=QF2V%2BRH%2C%20Paphos%2C%20Cyprus&z=15&output=embed",
  googleListingUrl: GOOGLE_LISTING_URL,
  makes: "Mercedes-Benz, Audi, Volkswagen and other German and Japanese makes",
} as const;

const weekday = (day: string): OpeningHour => ({
  day,
  hours: "8:00 – 17:00",
  opens: 8 * 60,
  closes: 17 * 60,
});

/** Monday first. Times are local to the garage (Europe/Nicosia). */
export const openingHours: OpeningHour[] = [
  weekday("Monday"),
  weekday("Tuesday"),
  weekday("Wednesday"),
  weekday("Thursday"),
  weekday("Friday"),
  { day: "Saturday", hours: "Closed", closed: true },
  { day: "Sunday", hours: "Closed", closed: true },
];

export const GARAGE_TIME_ZONE = "Asia/Nicosia";

export type ServiceIcon =
  "oil" | "brakes" | "ac" | "electrical" | "diagnostics" | "engine" | "opinion";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
}

export const routineServices: Service[] = [
  {
    id: "oil-change",
    icon: "oil",
    title: "Oil changes",
    description:
      "Fresh oil to the grade your engine was built for, drained, refilled and checked properly.",
  },
  {
    id: "brake-service",
    icon: "brakes",
    title: "Brake servicing",
    description: "Pads, discs and fluid inspected and replaced so the car stops the way it should.",
  },
  {
    id: "ac-service",
    icon: "ac",
    title: "A/C servicing",
    description:
      "A/C servicing and refrigerant recharging for reliable and efficient climate control.",
  },
  {
    id: "electical-repairs",
    icon: "electrical",
    title: "Electrical repairs",
    description:
      "Electrical diagnostics and repairs for starting, charging, lighting, sensors and other vehicle electrical systems.",
  },
];

export const routineServicesFooter =
  "Plus oil and cabin filters and the rest of the everyday jobs. If it isn't listed, ask.";

export const specialistServices: Service[] = [
  {
    id: "diagnostics",
    icon: "diagnostics",
    title: "Engine diagnostics",
    description:
      "Warning lights, misfires and intermittent faults traced to the real cause — not guessed at.",
  },
  {
    id: "engine-repair",
    icon: "engine",
    title: "Complex engine repairs",
    description:
      "Deeper mechanical work handled in-house, from stubborn leaks to serious internal faults.",
  },
  {
    id: "second-opinion",
    icon: "opinion",
    title: "Second opinions",
    description: "Been quoted for work you're unsure about? Bring it in and get a straight answer.",
  },
];

export interface Brand {
  name: string;
  note: string;
}

export const brands: Brand[] = [
  { name: "Mercedes-Benz", note: "Full vehicle servicing" },
  { name: "Audi", note: "Petrol and diesel engines" },
  { name: "Volkswagen", note: "Everyday reliability work" },
  { name: "And other makes", note: "Japanese, German and European cars" },
];

export interface GaragePhoto {
  src: string;
  alt: string;
  caption: string;
}

export const garagePhotos: GaragePhoto[] = [
  {
    src: garage1,
    alt: "Car raised on a two-post lift inside the workshop",
    caption: "In the workshop",
  },
  {
    src: garage2,
    alt: "Mechanic reading fault codes with a diagnostic scanner in an engine bay",
    caption: "Engine diagnostics",
  },
  {
    src: garage3,
    alt: "Fresh synthetic oil being poured into an engine during a service",
    caption: "Oil and filter service",
  },
  {
    src: garage4,
    alt: "Brake disc and caliper during a brake service with new pads ready",
    caption: "Brake service",
  },
];

export const reviewSummary = {
  rating: 4.3,
  count: 20,
  source: "Google reviews",
  url: GOOGLE_LISTING_URL,
} as const;

export interface CustomerReview {
  id: string;
  /** A sentence taken word for word from the review, used as the pull quote. */
  highlight: string;
  text: string;
}

export const customerReviews: CustomerReview[] = [
  {
    id: "mercedes-roof-diagnosis",
    highlight: "Then three minutes later he had diagnosed the fault.",
    text: `Well done to this garage. I had a fault on my old Merc CLK 17 years old and the roof stopped opening. I read all about it online. The nightmare of getting fixed and finding a garage that can do it.

Well I brought it to this garage. He topped up the hydraulic fluid that that had come out. Then three minutes later he had diagnosed the fault. THREE MINUTES!!!

It took me longer to look on the internet for that. I am waiting for the part now.

He will fit it and fix the roof. Oil the joints and the job will be done so I can enjoy the spring when it comes.

Well done Marios
Five 🌟🌟🌟🌟🌟.`,
  },
  {
    id: "communication-and-care",
    highlight: "Great communication, advises, best customer service.",
    text: `I highly recommend this mechanic. I wish I knew about him last year when my car stayed 1 month in Tony Michael garage for the same problem.

This guy is the mechanic of any woman, at least needs. As a woman l don't know much about cars. He is like a doctor. Had a look at the car and told me what's the problem, what he can do and when can be ready. And that in 24h after the car got in. Then called and told me about other issues he could see and may fix.

Great communication, advises, best customer service.
Thank you Mario. Deeply grateful for your services.`,
  },
  {
    id: "german-car-repair",
    highlight:
      "I was thinking to sell the car because we all know, German cars in Cyprus are not easy to maintain. Not anymore.",
    text: `This guy is a genius! I was thinking to sell the car because we all know, German cars in Cyprus are not easy to maintain. Not anymore.

Car got to him Sunday evening and Monday 9am is ready! Great communication and Best customer service at the best rates. Amazing!

Thank you Mario and team. You're the best, forget the rest 😉`,
  },
  {
    id: "mercedes-knocking-noise",
    highlight: "Marios found the problem in just 5 minutes and also helped fix a few other issues.",
    text: `Marios is an excellent mechanic and someone I can truly recommend. I searched all over Paphos for a mechanic who could fix a knocking noise in my old Mercedes. Another mechanic even told me to stop driving the car because it wasn’t worth repairing. Marios found the problem in just 5 minutes and also helped fix a few other issues. Thanks to him, I was able to sell the car in good working condition instead of sending it to the scrapyard, as other mechanics had suggested. He’s incredibly skilled, honest, and can fix almost anything. Highly recommended!`,
  },
];

/** The order a typical job runs in, drawn from how customers describe their visits. */
export const visitSteps = [
  {
    title: "Call and describe the problem",
    body: "Tell Marios what the car is doing. You'll get a straight view of what's likely involved and when to bring it in.",
  },
  {
    title: "Diagnosis first",
    body: "The fault is traced to its cause before anything is replaced. You hear what needs doing now and what can wait.",
  },
  {
    title: "Repair and collect",
    body: "Work goes ahead once you agree to it, and you're called as soon as the car is ready.",
  },
];

export const trustPoints = [
  {
    title: "Local and independent",
    body: "A Paphos garage where the person who diagnoses your car is the person who fixes it.",
  },
  {
    title: "Routine and difficult work",
    body: "From a straightforward service to engine faults other garages have given up on.",
  },
  {
    title: "Clear, honest answers",
    body: "You're told what the car needs now, what can wait, and what it will involve.",
  },
];
