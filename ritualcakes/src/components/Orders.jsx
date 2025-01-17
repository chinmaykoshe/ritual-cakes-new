import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCustomization } from "../context/customizeContext";
import { designnames } from "../designs/designassets";

function Orders() {
  const { orders, deleteOrder, error, loading } = useOrder();
  const { customizations, setCustomizations, error: customizationError } = useCustomization();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user");

  // Convert customizations to an array
  const customizationsArray = customizations ? Object.values(customizations) : [];

  // Find the customization for the logged-in user
  const result = customizationsArray.find(item => item.email === userEmail);

  const handleDeleteCustomization = async (customizationId) => {
    if (window.confirm("Are you sure you want to delete this customization? Please call +91 8169296802 before deleting")) {
      try {
        const response = await fetch(`https://ritual-cakes-new-ogk5.vercel.app/customizations/${customizationId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete customization');
        }

        alert('Customization deleted successfully!');
        // Optionally, remove the deleted customization from state to update the UI immediately
        setCustomizations(customizations.filter(item => item._id !== customizationId));
      } catch (err) {
        console.error('Error deleting customization:', err.message);
        alert('Error deleting customization. Please try again later.');
      }
    }
  };



  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await fetch(`https://ritual-cakes-new-ogk5.vercel.app/customizations/${userEmail}`);
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

  const getStatusColor = (status) => {
    if (status === "Placed") return "bg-green-500";
    if (status === "Pending") return "bg-yellow-500";
    if (status === "Cancelled") return "bg-red-500";
    return "bg-gray-500";
  };

  const handleDeleteOrder = async (orderId) => {
    alert("Please call +91 8169296802 before deleting");
    try {
      await deleteOrder(orderId);
    } catch (err) {
      console.error("Failed to delete order:", err.message);
      alert(
        "Error deleting the order. Please try again. Ensure to call +91 8169296802 before deleting"
      );
    }
  };

  // Display loading state
  if (loading || !orders) {
    return (
      <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 bg-opacity-80 mb-8"
        >
          &#8592; Back to Shop
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

        {/* Error display */}
        {customizationError && (
          <p className="text-red-500 text-center mb-4">{customizationError}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Display orders */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 bg-white rounded-lg shadow-lg p-6">
            {orders.map((order) => {
              const orderCustomization = order.userEmail
                ? customizationsArray.find(
                  (customizations) => customizations.email === order.userEmail
                )
                : null;

              return (
                <div key={order._id} className="p-6 rounded-lg shadow-lg flex flex-col space-y-4 border-b border-gray-300">
                  {order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
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
                          <p className="text-gray-500 text-sm">Amount: ${item.price * item.quantity}</p>
                        </div>

                        <div className="flex flex-col space-y-2 mt-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></span>
                            <p className="text-sm text-gray-500">Status: {order.status}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">Delivery Address:</p>
                            <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">Payment Method:</p>
                            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                          </div>

                          <div className="text-sm text-gray-500 mt-4">
                            <p>Order ID: {order._id}</p>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex justify-start md:justify-end">
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">No items in this order</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">You have no orders yet.</p>
        )}

        {/* Separate section for customizations */}
        <div className="mt-12 space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-center">All Customizations</h1>

          {customizations && customizations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {customizations.map((customization, index) => (
                <div
                  key={index}
                  className="p-6 bg-white pb-14 shadow-lg rounded-lg border border-gray-200 flex flex-col md:flex-row items-center"
                >
                  <div className="flex-1 space-y-2 text-gray-600 ">
                    <h4 className="font-semibold text-xl mb-4 ">ID: {customization._id}  </h4>
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
                    <p><strong>Approval Status:</strong> {customization.approvalStatus}</p>
                    <p><strong>Price:</strong> ${customization.price}</p>
                    <p className=""><strong>Image or Design:</strong></p>
                    <p className="break-all"> {customization.imageOrDesign || 'No image/design provided'}</p>


                  </div>

                  {/* Conditionally render the image on the right */}
                  {customization.imageOrDesign ? (
                    <div className="m-4 md:mt-0 md:ml-8 md:w-1/3 lg:w-1/3 w-full ">
                      {/* Debugging the URL */}
                      {customization.imageOrDesign.startsWith('http') ? (
                        // If it's a URL, use it directly
                        <img
                          src={customization.imageOrDesign} // Assuming the URL is stored directly in the DB
                          alt={`Design: ${customization.imageOrDesign}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src); // Log failed URL
                            e.target.src = '/fallback-image.jpg'; // Fallback image if the original fails
                          }}
                        />
                      ) : (
                        // If it's a filename, use the imported images from designnames
                        <img
                          src={designnames[customization.imageOrDesign] || '/path/to/fallback-image.jpg'}
                          alt={`Design: ${customization.imageOrDesign}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/path/to/fallback-image.jpg'; // fallback image
                          }}
                        />
                      )}

                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => handleDeleteCustomization(customization._id)}
                          className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Delete Customization
                        </button>
                      </div>

                    </div>
                  ) : null}



                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No customizations available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Orders;
