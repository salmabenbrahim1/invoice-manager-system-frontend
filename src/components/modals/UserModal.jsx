import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validatePhoneNumber, validateCIN } from "../../utils/validation";
import { useUser } from "../../contexts/UserContext";



const UserModal = ({ isOpen, onClose, onSubmit, isPerson, setIsPerson, error, user }) => {
    const { checkEmailExists } = useUser();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            const timer = setTimeout(() => setShowModal(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!showModal) return null;


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const errors = [];

        if (isPerson) {
            if (!data.cin) {
                errors.push("CIN is required");
            } else if (!validateCIN(data.cin)) {
                errors.push("Please enter a valid CIN (8 digits).");
            }

            if (!data.gender) errors.push("Gender is required");
            if (!data.firstName) errors.push("First Name is required");
            if (!data.lastName) errors.push("Last Name is required");
        } else {
            if (!data.companyName) errors.push("Company Name is required");
        }

        // Check if email already exists 
        try {
            const emailExists = await checkEmailExists(data.email);
            if (emailExists && !user && data.email !== user?.email) {
                toast.warn("This email is already in use by another user.");
                return;
            }
        } catch (error) {
            toast.error("Error verifying email availability");
            return;
        }

        if (!data.phone) {
            errors.push("Phone number is required");
        } else if (!validatePhoneNumber(data.phone)) {
            errors.push("Please enter a valid phone number (8-15 digits, optional '+').");
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.warn(error));
            return;
        }

        try {
            await onSubmit(e);
            onClose();
        } catch (error) {
            toast.error("Failed to create user");
        }
    };

    const RequiredStar = () => <span className="text-red-500">*</span>;

    return (
        <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center pt-8 pb-4 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}>
            <div className={`bg-white rounded-lg p-6 max-w-2xl w-full max-h-[calc(101vh-11rem)] shadow-xl ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-wide">
                    {user ? "Edit User" : "Create User"}
                </h2>

                <div className="flex flex-col space-y-5">
                    <div className="flex justify-center mb-6 space-x-1">
                        <button
                            onClick={() => setIsPerson(true)}
                            className={`w-1/2 py-2 rounded-l-xl transition-colors duration-200 ${isPerson ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Person
                        </button>
                        <button
                            onClick={() => setIsPerson(false)}
                            className={`w-1/2 py-2 rounded-r-xl transition-colors duration-200 ${!isPerson ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Company
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 text-sm">
                        {isPerson ? (
                            <>
                                <div className="col-span-1">
                                    <label htmlFor="cin" className="block mb-1 text-gray-700 font-medium">
                                        CIN <RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="cin"
                                        name="cin"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                        placeholder="Enter your CIN"
                                        defaultValue={user?.cin}
                                         maxLength={8}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="gender" className="block mb-1 text-gray-700 font-medium">
                                        Gender <RequiredStar />
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                        defaultValue={user?.gender || ""}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="firstName" className="block mb-1 text-gray-700 font-medium">
                                        First Name <RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                        placeholder="Enter first name"
                                        defaultValue={user?.firstName}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="lastName" className="block mb-1 text-gray-700 font-medium">
                                        Last Name <RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                        placeholder="Enter last name"
                                        defaultValue={user?.lastName}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2">
                                <label htmlFor="companyName" className="block mb-1 text-gray-700 font-medium">
                                    Company Name <RequiredStar />
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                    placeholder="Enter company name"
                                    defaultValue={user?.companyName}
                                />
                            </div>
                        )}

                        <div className="col-span-1">
                            <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
                                Email <RequiredStar />
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                placeholder="Email"
                                value={user?.email}
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="phone" className="block mb-1 text-gray-700 font-medium">
                                Phone <RequiredStar />
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e] transition-all duration-200"
                                placeholder="Phone number (8-15 digits)"
                                defaultValue={user?.phone}
                                maxLength={15}

                            />
                        </div>

                        <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Password will be auto-generated.</p>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>

                        <div className="col-span-2 flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#6d33a7] text-white px-5 py-2 rounded-lg hover:bg-[#5d2b91] transition-all duration-200"
                            >
                                {user ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;