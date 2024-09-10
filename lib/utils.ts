import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import gsap from "gsap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatRelativeDate = (from: Date | string | null | undefined) => {
  if (!from) {
    throw new Error("Invalid date provided");
  }

  const fromDate = new Date(from);
  const currentDate = new Date();

  if (isNaN(fromDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  if (currentDate.getTime() - fromDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(fromDate, { addSuffix: true });
  } else {
    if (fromDate.getFullYear() === currentDate.getFullYear()) {
      return formatDate(fromDate, "MMM d");
    } else {
      return formatDate(fromDate, "MMM d, yyyy");
    }
  }
};

export const formatNumber = (num : number) => {
  return new Intl.NumberFormat("en-US", {notation : "compact" , maximumFractionDigits : 1}).format(num)
}


export const animatePageIn = () => {
  const bannerOne = document.getElementById("banner-1");
  const bannerTwo = document.getElementById("banner-2");
  const bannerThree = document.getElementById("banner-3");
  const bannerFour = document.getElementById("banner-4");

  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    const tl = gsap.timeline();

    // Initial setup
    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: -100, // Start from above the viewport
      opacity: 0, // Start hidden
    })
    .to([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 0, // Move to original position
      opacity: 1, // Fade in
      stagger: 0.2,
      duration: 0.36, // Shortened duration for entrance animation
      ease: "power3.out",
      scale: 1.05, // Slight scale effect for entrance
    })
    .to([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 100, // Move out of viewport to bottom
      opacity: 0, // Fade out
      stagger: 0.2,
      duration: 0.3, // Shortened duration for exit animation
      ease: "power3.in",
      scale: 1, // Reset scale after entrance
      delay: 0.2, // Reduced delay before starting the exit animation
    });
  }
};
