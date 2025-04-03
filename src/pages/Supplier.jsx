import HandleLoading from "../components/HandleLoading";
import { FaAnglesRight, FaTruck } from "react-icons/fa6";
import { IoMdList } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import { useState, useEffect } from "react";
import apiConn from "../api"; // ✅ updated import

function SupplierManager() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierAddress, setAddress] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState(null);

  const fetchSuppliers = () => {
    setIsLoading(true);
    apiConn
      .get("api/suppliers/")
      .then((res) => setSupplierList(res.data))
      .catch(() => alert("Failed to fetch suppliers!"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const supplierData = {
      name: supplierName,
      phone: supplierPhone,
      email: supplierEmail,
      address: supplierAddress,
    };

    const request = isUpdating
      ? apiConn.put(`api/suppliers/${currentSupplierId}/`, supplierData)
      : apiConn.post("api/suppliers/", supplierData);

    request
      .then(() => {
        alert(`Supplier ${isUpdating ? "updated" : "added"} successfully!`);
        fetchSuppliers();
        handleCancel();
      })
      .catch(() =>
        alert(`Failed to ${isUpdating ? "update" : "add"} supplier!`)
      )
      .finally(() => setIsLoading(false));
  };

  const handleUpdate = (id) => {
    const supplier = supplierList.find((s) => s.id === id);
    if (supplier) {
      setSupplierName(supplier.name);
      setSupplierPhone(supplier.phone);
      setSupplierEmail(supplier.email);
      setAddress(supplier.address);
      setCurrentSupplierId(id);
      setIsUpdating(true);
    }
  };

  const handleCancel = () => {
    setSupplierName("");
    setSupplierPhone("");
    setSupplierEmail("");
    setAddress("");
    setCurrentSupplierId(null);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex columns-2 gap-6">
      {/* FORM */}
      <div className="md:w-[550px] h-[600px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          {isUpdating ? "Update Supplier" : "Add New Supplier"}
          {isUpdating ? <RxUpdate /> : <FaTruck />}
        </h2>
        <span className="text-sm text-gray-600 ml-3">Fill the form and submit.</span>

        <form className="mt-6 space-y-6 p-4" onSubmit={handleSubmit}>
          {[
            { label: "Supplier Name", id: "name", value: supplierName, set: setSupplierName, type: "text" },
            { label: "Supplier Mobile No", id: "phone", value: supplierPhone, set: setSupplierPhone, type: "text", pattern: "\\d{10}", title: "Please enter exactly 10 digits" },
            { label: "Supplier Email", id: "email", value: supplierEmail, set: setSupplierEmail, type: "email" },
            { label: "Supplier Address", id: "address", value: supplierAddress, set: setAddress, type: "text" },
          ].map(({ label, id, value, set, ...rest }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-600">{label}</label>
              <input
                required
                id={id}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder={`Enter ${label.toLowerCase()}`}
                {...rest}
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="submit"
              className="font-medium mt-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {isUpdating ? "Update Supplier" : "Add Supplier"}
            </button>
            {isUpdating && (
              <button
                type="button"
                onClick={handleCancel}
                className="font-medium mt-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SUPPLIER LIST */}
      <div className="md:w-[550px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          View Suppliers <IoMdList />
        </h2>
        <div className="bg-slate-100 mt-3 rounded-xl w-[540px] h-[500px]">
          <div className="bg-blue-600 h-[45px] rounded-t-xl flex">
            {["Id", "Name", "Email", "Mobile"].map((col, i) => (
              <div
                key={col}
                className={`flex-1 text-white text-center pt-3 font-semibold ${
                  i !== 3 ? "border-r-2 border-white" : ""
                }`}
              >
                {col}
              </div>
            ))}
          </div>

          <div className="h-[455px] overflow-y-auto rounded-b-xl">
            {supplierList.map((supplier) => (
              <div
                key={supplier.id}
                className="flex h-[45px] border-t-2 border-gray-300"
              >
                <div className="flex-1 text-center text-gray-700 pt-2 border-r-2 border-gray-300">
                  {supplier.id}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300">
                  {supplier.name}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300 truncate">
                  {supplier.email}
                </div>
                <div className="flex-1 text-center text-gray-700 pt-2">
                  {supplier.phone}
                  <button onClick={() => handleUpdate(supplier.id)}>
                    <FaAnglesRight className="ml-3 text-xl inline-block" />
                  </button>
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

export default SupplierManager;
