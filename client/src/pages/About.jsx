import React from 'react';

export default function About() {
  return (
    <div className="py-20 px-2 sm:px-6 max-w-[98vw] w-full mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-lg px-4 sm:px-16 py-14 mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-slate-800 tracking-tight text-center">
          Welcome to RooMoo – Your Gateway to Seamless Living in Hyderabad!
        </h1>
        <div className="max-w-6xl mx-auto">
          <p className="mb-6 text-xl text-slate-700 text-center">
            Discover convenience and comfort with RooMoo, your dedicated platform for renting rooms, flats, and houses in the vibrant city of Hyderabad. <br />
            Our mission is to simplify the process of finding your perfect living space—making it easy to find a home that truly suits your lifestyle.
          </p>
          <p className="mb-6 text-lg text-slate-700 text-center">
            At RooMoo, we understand that the right living space makes all the difference. Whether you're a student, a professional, or a family seeking a cozy nest, we've got you covered. Our user-friendly website connects landlords and tenants, creating a harmonious and transparent renting experience for everyone.
          </p>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-12 mt-14">
          <div className="flex-1 min-w-[280px]">
            <h2 className="text-2xl font-bold mb-5 text-slate-800">Key Features</h2>
            <ul className="space-y-7 text-base text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">1. Extensive Listings:</span>
                <br />
                Explore a wide variety – from single rooms to spacious flats and entire houses. Choose from options for every budget and preference.
              </li>
              <li>
                <span className="font-semibold text-slate-900">2. Easy Navigation:</span>
                <br />
                Enjoy a seamless website experience. Find your next home in Hyderabad with just a few clicks, filtering results to your requirements.
              </li>
              <li>
                <span className="font-semibold text-slate-900">3. Local Focus:</span>
                <br />
                RooMoo is currently available exclusively in Hyderabad. By focusing on this city, we provide tailored, community-driven service for all residents.
              </li>
              <li>
                <span className="font-semibold text-slate-900">4. Verified Listings:</span>
                <br />
                Trust matters! Our platform features verified listings so you can feel secure in every property you view.
              </li>
              <li>
                <span className="font-semibold text-slate-900">5. Transparent Communication:</span>
                <br />
                We make landlord–tenant communication smooth, open, and secure—so renting is always hassle-free.
              </li>
              <li>
                <span className="font-semibold text-slate-900">6. User Support:</span>
                <br />
                Our friendly support team is here to help at every step, whether you have questions about a property or need rental guidance.
              </li>
            </ul>
          </div>
          <div className="flex-1 min-w-[280px] flex flex-col justify-center">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-10 rounded-xl shadow-inner text-slate-800 mb-10 text-center">
              <h3 className="text-xl font-bold mb-3">Why Choose RooMoo?</h3>
              <p>
                Experience the joy of hassle-free living by letting RooMoo be your trusted partner in the Hyderabad rental market.
                <br /><br />
                Join our community today and find the perfect home to complement your lifestyle!
              </p>
            </div>
            <div className="mt-3 font-serif text-lg text-orange-800 font-medium text-center">
              RooMoo – Where Comfort Meets Convenience in Hyderabad!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
