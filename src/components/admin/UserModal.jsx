import React from "react";

const UserModal = ({ isOpen, onClose, onSubmit, isPerson, setIsPerson, error, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg w-96 relative" onClick={(e) => e.stopPropagation()}>
                {/* Close button top-right */}
                <button
                 onClick={onClose}
                 className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors duration-200 text-2xl font-bold"
                 aria-label="Close modal"
                          >
                         &times;
                </button>


                <h2 className="text-3xl font-bold mb-6 text-gray-900">{user ? "Edit User" : "Sign Up"}</h2>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsPerson(true)}
                        className={`${isPerson ? "bg-[#75529e]" : "bg-gray-200"} text-white py-2 px-4 rounded-l-lg focus:outline-none`}
                    >
                        Person
                    </button>
                    <button
                        onClick={() => setIsPerson(false)}
                        className={`${!isPerson ? "bg-[#75529e]" : "bg-gray-200"} text-white py-2 px-4 rounded-r-lg focus:outline-none`}
                    >
                        Company
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {isPerson ? (
                        <>
                            <div>
                                <label htmlFor="cin" className="block text-sm font-medium text-gray-700">CIN</label>
                                <input
                                    type="text"
                                    id="cin"
                                    name="cin"
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter your CIN"
                                    defaultValue={user?.cin}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#75529e]"
                                    defaultValue={user?.gender}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter your first name"
                                        required
                                        defaultValue={user?.firstName}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter your last name"
                                        required
                                        defaultValue={user?.lastName}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter company name"
                                defaultValue={user?.companyName}
                            />
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter your email"
                                required
                                defaultValue={user?.email}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter your phone number"
                                required
                                defaultValue={user?.phone}
                            />
                        </div>
                    </div>

                    <div className="text-sm text-gray-700">Password will be auto-generated.</div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">{user ? "Update" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
