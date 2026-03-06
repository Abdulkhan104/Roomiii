import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import payimg from "../assets/NavBar/Pay.png";
import { useSelector } from "react-redux";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { options } from "joi";


// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState("");
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);

        const price = data.offer ? data.discountPrice : data.regularPrice;
        const formattedPrice = price.toLocaleString("INR");
        setFormattedPrice(formattedPrice);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);


  const checkoutHandler = async () => {
    try {
      const keyResponse = await fetch(`/api/getkey`);
      const keyData = await keyResponse.json();
      
      const response = await fetch(`/api/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: params.listingId,
          price: listing.offer ? listing.discountPrice : listing.regularPrice,
          userId: currentUser.id,
        }),
      });
      const data = await response.json();
      console.log(options);
      if (response.ok) {
        const { order_id, amount } = data;
        
        // Initialize options for Razorpay payment
        const options = {
          key: keyData.key, // Replace with your Razorpay key ID
          amount: amount, // Amount in currency subunits
          currency: "INR",
          name: "Roomoo official", // Replace with your company name
          description: "Transaction", // Replace with your transaction description
          image: payimg, // Replace with your company logo URL
          order_id: order_id, // Razorpay order ID obtained from backend
          handler: async (response) => {
            try {
              const res = await fetch(`/api/payment/paymentverification`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json'
                },
                body: JSON.stringify({
                  
                  razorpay_order_id: response.order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  listingId: response.listingId,
                  userId:currentUser.id,
                }),
              });
    
              const verifyData = await res.json();
    
              if (verifyData.success) {
                console.log("Payment verification successful");
              } else {
                console.error("Payment verification failed");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
            }
            },
            prefill: {
              name: currentUser.username,
              email: currentUser.email,
            },
          theme: {
            color: "#030B14", // Replace with your preferred theme color
          },
        };
        // Initialize Razorpay payment form with the options
        const razorpay = new Razorpay(options);
        razorpay.open();
      } else {
        // Handle error state or display error message to the user
        console.error("Error fetching Razorpay order:", data.error);
      }
      console.log(data); 
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle error state or display error message to the user
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper modules={[Autoplay]} autoplay={true} navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex lg:flex-row md:flex-col sm:flex-col flex-wrap">
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className="text-2xl font-semibold">
                {listing.name} - ₹ {formattedPrice}
                {listing.type === "rent" && " / month"}
              </p>
              <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <div className="flex gap-4">
                <button className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </button>
                {listing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} bedrooms `
                    : `${listing.bedrooms} bedroom `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} bathrooms `
                    : `${listing.bathrooms} bathroom `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
              </ul>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    Contact landlord
                  </button>
                )}
              {contact && <Contact listing={listing} />}
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={checkoutHandler}
                    className="bg-[#ed5012] text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    buy
                  </button>
                )}
            </div>

            {/* Rating */}
            <div className="mt-11">
              <div class="bg-white p-8 rounded shadow-md w-96">
                <h1 class="text-2xl font-bold mb-4">Rate The Property</h1>
                <p class="text-gray-600 mb-4">
                  Please provide your feedback by this Property .
                </p>

                <div class="flex items-center mb-4">
                  <div class="mr-2">
                    <input
                      type="radio"
                      id="star5"
                      name="rating"
                      value="5"
                      class="hidden"
                    />
                    <label for="star5" class="text-2xl cursor-pointer">
                      &#9733;
                    </label>
                  </div>
                  <div class="mr-2">
                    <input
                      type="radio"
                      id="star4"
                      name="rating"
                      value="4"
                      class="hidden"
                    />
                    <label for="star4" class="text-2xl cursor-pointer">
                      &#9733;
                    </label>
                  </div>
                  <div class="mr-2">
                    <input
                      type="radio"
                      id="star3"
                      name="rating"
                      value="3"
                      class="hidden"
                    />
                    <label for="star3" class="text-2xl cursor-pointer">
                      &#9733;
                    </label>
                  </div>
                  <div class="mr-2">
                    <input
                      type="radio"
                      id="star2"
                      name="rating"
                      value="2"
                      class="hidden"
                    />
                    <label for="star2" class="text-2xl cursor-pointer">
                      &#9733;
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="star1"
                      name="rating"
                      value="1"
                      class="hidden"
                    />
                    <label for="star1" class="text-2xl cursor-pointer">
                      &#9733;
                    </label>
                  </div>
                </div>

                {/* <!-- Comment Box --> */}
                <div class="mt-4">
                  <label
                    for="comments"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Comments (optional)
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows="3"
                    class="mt-1 p-2 border rounded w-full focus:outline-none focus:ring focus:border-blue-300"
                  ></textarea>
                </div>

                {/* <!-- Submit Button --> */}
                <button class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
