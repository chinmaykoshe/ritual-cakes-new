import React from 'react';

function About() {
  const reviews = [
    { id: 1, name: "John Thakur", text: "Amazing cakes! Highly recommend!" },
    { id: 2, name: "Jane Mhate", text: "The chocolates were incredible!" },
    { id: 3, name: "Emily Patil", text: "Delicious cupcakes, will order again!" }
  ];

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-6 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-6 lg:px-8 mt-4 shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">About Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
            <div className="md:ml-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Custom Bakes</h2>
              <p className="text-lg text-gray-700 mb-4">
                At Ritual Cakes in Uran, we offer a variety of freshly baked treats for all your special occasions. From sponge to chocolate cakes, we customize each cake to your preference...
              </p>
              <p className="text-lg text-gray-700 mb-4">
                For inquiries or to place an order, call us at <a href="tel:+917021482775" className="text-blue-600 hover:text-blue-800">+91 7021482775</a> or DM us on Instagram or Facebook.
              </p>
            </div>
            <img
              src="/custom-bakes.jpg"
              alt="Custom Cakes"
              className="w-full md:w-1/2 rounded-lg mb-4 mx-2 md:mb-0 shadow-md object-cover h-[300px]"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
            <img
              src="/chocolates.jpg"
              alt="Chocolates"
              className="w-full md:w-1/2 rounded-lg mb-4 mx-2 md:mb-0 shadow-md object-cover h-[300px]"
            />
            <div className="md:mr-8 px-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chocolates</h2>
              <p className="text-lg text-gray-700 mb-4">
                In addition to our custom cakes, we offer a selection of mouth-watering chocolates like wine chocolates, stuffed chocolates, and cotton candy-stuffed chocolates...
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Visit us to indulge in our delightful range of cakes and chocolates. Everyone loves cakes and chocolates, don’t they?
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Customer Reviews</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 relative hover:shadow-xl transition-shadow duration-300"
              >
                <h1 className='text-8xl my-[-48px]'>&ldquo;</h1>

                <div className="flex items-center mb-4">
                  <span className="text-xl font-semibold text-gray-800">{review.name}</span>
                  <div className="text-yellow-500 ml-2">★★★★★</div>
                </div>
                <p className="text-gray-700 text-lg italic">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
