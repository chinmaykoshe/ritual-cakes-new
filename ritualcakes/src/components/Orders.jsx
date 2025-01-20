import React, { useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCustomization } from "../context/customizeContext";
import { designnames } from "../designs/designassets";


function Orders() {
  const { orders, deleteOrder, error, loading } = useOrder();
  const { customizations, setCustomizations, error: customizationError } = useCustomization();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user");

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await fetch(
          `https://ritual-cakes-new-ogk5.vercel.app/api/customizations/${userEmail}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customizations");
        }
        const data = await response.json();
        setCustomizations(data);
      } catch (err) {
        console.error("Error fetching customizations:", err.message);
      }
    };

    if (userEmail) {
      fetchCustomizations();
    }
  }, [userEmail, setCustomizations]);


  // Show login prompt if user is not signed in
  if (!userEmail) {
    return (
      <div className="mx-2 max-w-7xl md:mx-auto py-4 py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
         {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/" // Assuming "/designs" is your designs list page
          className="text-brown font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
        >
          &larr; Back to Home
        </Link>
      </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
          <p className="text-lg mb-4">Please log in to view your orders and customizations.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
 {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/" // Assuming "/designs" is your designs list page
          className="text-brown font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
        >
          &larr; Back to Home
        </Link>
      </div>

        {/* Orders Section */}
        <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 bg-white rounded-lg shadow-lg p-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-lg shadow-lg flex flex-col space-y-4 border-b border-gray-300"
              >
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/path/to/fallback-image.jpg"}
                        alt={item.name}
                        className="md:h-52 object-cover rounded-lg mb-4 md:mb-0"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h2 className="text-xl font-bold">{item.name}</h2>
                      <p className="text-gray-500 text-sm">Shape: {item.shape}</p>
                      <p className="text-gray-500 text-sm">Weight: {item.weight}</p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      <p className="text-gray-500 text-sm">Amount: $ {item.price * item.quantity}</p>
                    </div>
                    <div className="flex flex-col space-y-2 mt-4">
                      <div className="flex items-center space-x-2">
                       
                      <span className={`ml-2 px-2 py-1 rounded ${order.status === 'Completed' ? 'bg-blue-200 text-blue-700' : order.status === 'Pending' ? 'bg-yellow-200 text-yellow-700' : 'bg-red-200 text-red-700'}`}>
    {order.status}
  </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => alert('Call +91 --------- to cancel the order')}
                          className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">You have no orders yet.</p>
        )}

        {/* Customizations Section */}
        <div className="mt-12 space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-center">All Customizations</h1>
          {customizations && customizations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {customizations.map((customization, index) => (
                <div
                  key={index}
                  className="p-6 bg-white pb-14 shadow-lg rounded-lg border border-gray-200 flex flex-col md:flex-row items-center"
                >
                  <div className="flex-1 space-y-2 text-gray-600">
                    <h4 className="font-semibold text-xl mb-4">ID: {customization._id}</h4>
                    <p><strong>Name:</strong> {customization.name}</p>
                    <p><strong>Email:</strong> {customization.email}</p>
                    <p><strong>Phone:</strong> {customization.phone}</p>
                    <p><strong>Address:</strong> {customization.address}</p>
                    <p><strong>Size:</strong> {customization.size}</p>
                    <p><strong>Cake Type:</strong> {customization.cakeType}</p>
                    <p><strong>Flavor:</strong> {customization.flavor}</p>
                    <p><strong>Message:</strong> {customization.message}</p>
                    <p><strong>Special Instructions:</strong> {customization.specialInstructions || 'N/A'}</p>
                    <p><strong>Delivery Date:</strong> {new Date(customization.deliveryDate).toLocaleDateString()}</p>
                  <p>
  <span
    className={`px-2 py-1 rounded ${
      customization.approvalStatus === 'approved'
        ? 'bg-green-200 text-green-700'
        : customization.approvalStatus === 'pending'
        ? 'bg-blue-200 text-blue-700'
        : customization.approvalStatus === 'rejected'
        ? 'bg-red-200 text-red-700'
        : 'bg-yellow-200 text-yellow-700'
    }`}
  >
    {customization.approvalStatus}
  </span>
</p>

                    <p className="text-lg"><strong>Price:</strong> ${customization.price}</p>
                    <p><strong>Image or Design:</strong></p>
                    <p className="break-all">{customization.imageOrDesign || 'No image/design provided'}</p>
                  </div>

                  {/* Image Section */}
                  {customization.imageOrDesign ? (
                    <div className="m-4 md:mt-0 md:ml-8 md:w-1/3 lg:w-1/3 w-full">
                      {customization.imageOrDesign.startsWith('http') ? (
                        <img
                          src={customization.imageOrDesign}
                          alt={`Design: ${customization.imageOrDesign}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                        />
                      ) : (
                        <img
                          src={designnames[customization.imageOrDesign] || '/fallback-image.jpg'}
                          alt={`Design: ${customization.imageOrDesign}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                        />
                      )}

                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => alert('Call +91 --------- to cancel the order')}
                          className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Cancel Customization
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">You have no customizations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
