import React from "react";
import aboutImage from "../../../public/assets/logo.png";
import "./page.css";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div
            className="col-lg-6 order-1 order-lg-2"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="about-img">
              <Image src={aboutImage} alt="" />
            </div>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
            <h3>Welcome to TimeLock</h3>
            <p className="fst-italic">
              Timelock is a digital time capsule, designed to preserve personal
              memories, stories, and milestones across generations. By capturing
              and securely storing lifes precious moments, Timelock ensures that
              each memory endures, ready to be shared and cherished in the years
              to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
