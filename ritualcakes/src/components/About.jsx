import React from 'react';
// import aboutImage1 from '../assets/custom-cake.jpg';  // Add your custom cake image
// import aboutImage2 from '../assets/chocolates.jpg';   // Add your chocolates image

function About() {
  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8  mt-2 lg:m-top-16 shadow-lg">

    <div className="container mx-auto p-2 md:py-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* <img src={aboutImage1} alt="Custom Cakes" className="w-full rounded-lg mb-4" /> */}
          <h2 className="md:text-2xl text-xl font-bold mb-2">Custom Bakes</h2>
          <p className="md:text-lg text-sm mb-4">
            At Ritual Cakes in Navi Mumbai, we pride ourselves on offering a variety of delicious, freshly baked treats that cater to all your special occasions. Our artisan bakers are skilled in crafting cakes of different sizes, types, and flavors, including sponge, carrot, chocolate, and more. Whether you need a custom cake with personalized icing and lettering or a specific type of flour, we tailor-make each cake to your specifications.
          </p>
          <p className="md:text-lg text-sm mb-4">
            For any inquiries or to place an order, give us a call at <a href="tel:+917021482775" className="text-gray-500 hover:text-blue-700">+91 7021482775</a> or DM us on Instagram or Facebook.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* <img src={aboutImage2} alt="Chocolates" className="w-full rounded-lg mb-4" /> */}
          <h2 className="md:text-2xl text-xl font-bold mb-2">Chocolates</h2>
          <p className="md:text-lg text-sm mb-4">
            In addition to our custom bakes, we also provide a selection of mouth-watering chocolates, including wine chocolates, stuffed chocolates, and cotton candy-stuffed chocolates. Our shop also features freshly handcrafted cupcakes and muffins, ensuring that whether you're indulging yourself or buying a gift for a friend, you'll leave satisfied.
          </p>
          <p className="md:text-lg text-sm mb-4">
            Visit us to experience our delightful range of cakes and chocolates, because everyone loves cakes and chocolates, don’t they?
          </p>
        </div>
      </div>
      


      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h2>
        
  <div className="flex flex-col md:flex-row justify-center gap-6">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 relative">
    <div className="absolute md:top-[-6px] top-[-28px] left-4 text-8xl text-gray-300">
      &ldquo;
    </div>
      <div className="flex items-center my-4 ">
        <span className=" md:text-xl text-lg font-semibold">John Doe</span>
        <div className="text-yellow-500 text-m md:text-lg ml-2">★★★★★</div>
      </div>
      <p className="text-gray-700 md:text-lg text-sm">
        "Amazing cakes! The custom designs are exactly what I wanted. The taste is incredible. Highly recommend Ritual Cakes!"
      </p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 relative">
    <div className="absolute md:top-[-6px] top-[-28px] left-4 text-8xl text-gray-300">
      &ldquo;
    </div>
      <div className="flex items-center my-4 ">
        <span className=" md:text-xl text-lg font-semibold">Jane Smith</span>
        <div className="text-yellow-500 text-m md:text-lg ml-2">★★★★★</div>
      </div>
      <p className="text-gray-700 md:text-lg text-sm">
      "I ordered a batch of chocolates for my friend's birthday, and they were a hit! Everyone loved them, especially the wine chocolates."
      </p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 relative">
    <div className="absolute md:top-[-6px] top-[-28px] left-4 text-8xl text-gray-300">
      &ldquo;
    </div>
      <div className="flex items-center my-4 ">
        <span className=" md:text-xl text-lg font-semibold">Emily Brown</span>
        <div className="text-yellow-500 text-m md:text-lg ml-2">★★★★★</div>
      </div>
      <p className="text-gray-700 md:text-lg text-sm">
      "The cupcakes and muffins are to die for. Fresh and delicious! Will definitely order again."
      </p>
    </div>
        </div>
      </div>
    </div>

    </div>

  );
}

export default About;
