import HandleLoading from "../components/HandleLoading";
import { FaArrowRightArrowLeft, FaChevronDown, FaTrashCan, FaPlus } from "react-icons/fa6";
import { IoMdList } from "react-icons/io";
import { useState, useEffect } from "react";
import apiConn from "../api"; // ✅ renamed

function SalesManager() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [salesProducts, setSalesProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [salesList, setSalesList] = useState([]);

  const fetchSales = () => {
    setIsLoading(true);
    apiConn
      .get("api/sales/")
      .then((res) => setSalesList(res.data))
      .catch(() => alert("Failed to fetch sales!"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      apiConn.get("api/customers/"),
      apiConn.get("api/products/all/"),
    ])
      .then(([customerRes, productRes]) => {
        setCustomerList(customerRes.data);
        setSalesProducts(productRes.data);
      })
      .catch(() => alert("Failed to fetch customer/product data."))
      .finally(() => setIsLoading(false));

    fetchSales();
  }, []);

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", amount: "", price: 0 },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;

    if (field === "productId") {
      const product = salesProducts.find((p) => p.id === parseInt(value));
      updated[index].price = product ? product.sellingPrice : 0;
    }

    setSelectedProducts(updated);
    calculateSubtotal(updated);
  };

  const handleRemoveProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
    calculateSubtotal(updated);
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.amount,
      0
    );
    setSubtotal(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { id: saleId },
      } = await apiConn.post("api/sales/", {
        customer: selectedCustomer,
      });

      await Promise.all(
        selectedProducts.map(({ productId, amount }) =>
          apiConn.post("api/sales/items/", {
            sale: saleId,
            product: productId,
            quantity: amount,
          })
        )
      );

      alert("Sale created successfully!");
      setSelectedProducts([]);
      setSubtotal(0);
      setSelectedCustomer("");
      fetchSales();
    } catch {
      alert("Failed to create sale!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex col-span-2 gap-6">
      {/* LEFT FORM */}
      <div className="md:w-[550px] h-[670px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          Add Sale <FaArrowRightArrowLeft />
        </h2>
        <span className="text-sm text-gray-600 ml-3">
          Fill in the form to add a sale
        </span>

        <form className="mt-6 space-y-6 p-4" onSubmit={handleSubmit}>
          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Select Customer
            </label>
            <div className="relative">
              <select
                required
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white appearance-none pr-8"
              >
                <option value="">Select a customer</option>
                {customerList.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FaChevronDown />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <h3 className="block text-sm font-medium text-gray-600">
              Selected Products
            </h3>
            <div className="bg-gray-100 w-[539px] h-[250px] overflow-y-auto rounded-lg p-3">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex gap-2 mb-4">
                  <select
                    required
                    value={item.productId}
                    onChange={(e) =>
                      handleProductChange(index, "productId", e.target.value)
                    }
                    className="bg-slate-50 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select a product</option>
                    {salesProducts.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>

                  <input
                    required
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) =>
                      handleProductChange(index, "amount", e.target.value)
                    }
                    className="w-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />

                  <span className="w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    {item.price}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    <FaTrashCan />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal + Add Product */}
          <div className="flex items-center justify-between">
            <span className="text-base">Subtotal: {subtotal}</span>
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-700 text-white rounded-md flex items-center"
            >
              Add Product <FaPlus className="ml-2" />
            </button>
          </div>

          <button
            type="submit"
            className="font-medium mt-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Submit Sale
          </button>
        </form>
      </div>

      {/* RIGHT LIST */}
      <div className="md:w-[550px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          View Sales <IoMdList />
        </h2>
        <div className="bg-slate-100 mt-3 rounded-xl w-[540px] h-[590px]">
          <div className="bg-blue-600 h-[45px] rounded-t-xl flex columns-4">
            {["Id", "Customer", "Date", "Total (PHP)"].map((label, i) => (
              <div
                key={label}
                className={`flex-1 text-white text-center pt-3 font-semibold ${
                  i !== 3 ? "border-r-2 border-white" : ""
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="h-[544px] overflow-y-auto rounded-b-xl">
            {salesList.map((sale) => (
              <div
                key={sale.id}
                className="flex h-[45px] border-t-2 border-gray-300"
              >
                <div className="flex-1 text-gray-700 text-center pt-2 border-r-2 border-gray-300">
                  {sale.id}
                </div>
                <div className="flex-1 text-gray-700 text-center pt-2 border-r-2 border-gray-300">
                  {sale.customer_name}
                </div>
                <div className="flex-1 text-gray-700 text-center pt-2 border-r-2 border-gray-300">
                  {new Date(sale.created_at).toLocaleDateString()}
                </div>
                <div className="flex-1 text-gray-700 text-center pt-2">
                  {sale.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <HandleLoading />}
    </div>
  );
}

export default SalesManager;
