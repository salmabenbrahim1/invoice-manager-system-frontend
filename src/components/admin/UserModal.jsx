import React from "react";

const UserModal = ({ isOpen, onClose, onSubmit, isPerson, setIsPerson, error, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-wide">
                    {user ? "Edit User" : "Create User"}
                </h2>

                <div className="flex justify-center mb-6 space-x-1">
                    <button
                        onClick={() => setIsPerson(true)}
                        className={`w-1/2 py-2 rounded-l-xl transition-colors ${
                            isPerson ? "bg-[#75529e] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Person
                    </button>
                    <button
                        onClick={() => setIsPerson(false)}
                        className={`w-1/2 py-2 rounded-r-xl transition-colors ${
                            !isPerson ? "bg-[#75529e] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Company
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 text-sm">
                    {isPerson ? (
                        <>
                            <div>
                                <label htmlFor="cin" className="block mb-1 text-gray-700 font-medium">CIN</label>
                                <input
                                    type="text"
                                    id="cin"
                                    name="cin"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                    placeholder="Enter your CIN"
                                    defaultValue={user?.cin}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block mb-1 text-gray-700 font-medium">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                    defaultValue={user?.gender}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="block mb-1 text-gray-700 font-medium">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                        placeholder="Enter first name"
                                        required
                                        defaultValue={user?.firstName}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="block mb-1 text-gray-700 font-medium">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                        placeholder="Enter last name"
                                        required
                                        defaultValue={user?.lastName}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label htmlFor="companyName" className="block mb-1 text-gray-700 font-medium">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                placeholder="Enter company name"
                                defaultValue={user?.companyName}
                            />
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                placeholder="Email"
                                required
                                defaultValue={user?.email}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="phone" className="block mb-1 text-gray-700 font-medium">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75529e]"
                                placeholder="Phone number"
                                required
                                defaultValue={user?.phone}
                            />
                        </div>
                    </div>

                    <p className="text-gray-500 text-xs">Password will be auto-generated.</p>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#75529e] text-white px-5 py-2 rounded-lg hover:bg-[#674288] transition-all">
                            {user ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
