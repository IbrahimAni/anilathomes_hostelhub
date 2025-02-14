import React from "react";

const LandingPage = () => {
  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="text-2xl font-bold text-[#6c63ff]"></div>
        <nav className="space-x-4">
          <a href="#" className="text-black hover:underline">
            Home
          </a>
          <a href="#" className="text-black hover:underline">
            Hostels
          </a>
          <a href="#" className="text-black hover:underline">
            About
          </a>
          <button className="px-4 py-2 bg-black text-white rounded">
            Sign In
          </button>
        </nav>
      </header>

      {/* Main Section */}
      <main
        className="bg-cover bg-center min-h-[800px]"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1500x500')",
        }}
      >
        <div className="bg-black bg-opacity-50 py-16 px-4 text-center">
          <h1 className="text-6xl text-white font-bold">
            Find Your Perfect Hostel
          </h1>
          <p className="mt-4 text-xl text-white">
            Discover unique stays at the best prices worldwide
          </p>

          {/* Search Form */}
          <div className="mt-8 bg-white inline-block p-6 rounded-lg">
            <form className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-left">Location</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded h-[42px]">
                  <option value="">Select Location</option>
                  <option value="kwasu">KWASU Malete</option>
                  <option value="tanke">Tanke Ilorin</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-left">
                  Move In Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-left">Occupants</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded h-[42px]">
                  <option>1 Occupant</option>
                  <option>2 Occupants</option>
                  <option>3 Occupants</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded"
              >
                Search Hostels
              </button>
            </form>
          </div>
        </div>
        <section className="py-10 bg-gray-100 text-center">
          <h2 className="text-3xl font-bold">Featured Hostels</h2>
          <p className="mt-2 text-lg">Discover our hand picked selection of amazing hostels</p>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
