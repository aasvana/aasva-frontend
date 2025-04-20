import React from "react";

const About = () => {
  return <div>About</div>;
};

export default About;
export const metadata = {
  title: "About",
  description: "About page",
};
export const dynamic = "force-dynamic"; // Revalidate on every request