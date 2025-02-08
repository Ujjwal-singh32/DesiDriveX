import React from "react";
import Title from "../components/Title";
import profile_back from "../assets/carassets/profile_back1.avif";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-5 flex flex-col md:flex-row gap-16 ml-2">
        <img
          className="w-full md:max-w-[450px] ml-1"
          src={profile_back}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4  text-black-600 ">
          <p>
            Welcome to DesiDriveX, your go-to platform for seamless and
            efficient car rentals. Our mission is to simplify the car rental
            experience, making it accessible and hassle-free for everyone. At
            DesiDriveX, we believe in: Convenience: Search, sort, and book cars
            effortlessly from the comfort of your home. Transparency: No hidden
            charges, no surprises. Get complete details upfront. Reliability: We
            partner with trusted car owners to ensure every ride is safe and
            dependable. Whether you’re planning a weekend getaway, a business
            trip, or simply need a car for your daily errands, [App Name] is
            here to make your journey smooth and enjoyable. With features like
            instant booking, secure payment options, and real-time
            notifications, our app is designed to cater to your every need.
            Explore, compare, and book cars with just a few clicks! Join the
            growing community of happy renters and owners today. Let’s drive
            towards better mobility together!
          </p>
          <p>
            Whether you’re planning a weekend getaway, a business trip, or
            simply need a car for your daily errands, [App Name] is here to make
            your journey smooth and enjoyable. With features like instant
            booking, secure payment options, and real-time notifications, our
            app is designed to cater to your every need. Explore, compare, and
            book cars with just a few clicks! Join the growing community of
            happy renters and owners today. Let’s drive towards better mobility
            together! Whether you’re planning a weekend getaway, a business
            trip, or simply need a car for your daily errands, [App Name] is
            here to make your journey smooth and enjoyable. With features like
            instant booking, secure payment options, and real-time
            notifications, our app is designed to cater to your every need.
            Explore, compare, and book cars with just a few clicks! Join the
            growing community of happy renters and owners today. Let’s drive
            towards better mobility together!
          </p>
          <b className="text-black-800">--Our Mission--</b>
          <p>
            {" "}
            Our mission at DesiDriveX is to transform the car rental experience
            by providing a simple, transparent, and reliable platform that
            empowers users with affordable and convenient access to vehicles. We
            strive to build a trusted community of renters and car owners while
            enhancing mobility solutions for work, travel, and everyday needs.
            Through continuous innovation, we aim to redefine transportation and
            make every journey seamless and enjoyable.
          </p>
        </div>
      </div>

      <div className="text-2xl py-4 ml-8 text-center my-3">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-black-700">
            {" "}
            At DesiDriveX, we are committed to delivering the highest standards
            of quality assurance, ensuring a seamless and reliable car rental
            experience for every user. With a focus on convenience, we’ve
            designed our platform to be user-friendly, efficient, and accessible
            anytime, anywhere. Our dedication to building excellent customer
            relationships drives us to provide exceptional support, transparent
            communication, and personalized solutions, making every interaction
            with our app a truly satisfying experience.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-black-700">
            {" "}
            At DesiDriveX, convenience is at the heart of everything we do. From
            an intuitive interface to quick booking processes and flexible
            options, we make it easy for you to find the perfect car for your
            needs with just a few clicks, anytime, anywhere..{" "}
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Excellent Customer Relation:</b>
          <p className="text-black-700">
            We prioritize building strong and lasting relationships with our
            customers by offering responsive support, personalized assistance,
            and a commitment to exceeding expectations. Your satisfaction is our
            success, and we’re here to ensure every experience with [App Name]
            is nothing short of exceptional.
          </p>
        </div>
      </div>
      <div className="border-b border-black-200 "></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default About;
