import React from "react";

const OfferSection = () => {
  const offers = [
    {
      id: "01",
      title: "Job Recommendation",
      description: "Personalized job matches tailored to your skills and preferences",
      image: "./src/assets/offer-1.jpg",
    },
    {
      id: "02",
      title: "Create & Build Portfolio",
      description: "Showcase your expertise with professional portfolio design",
      image: "./src/assets/offer-2.jpg",
    },
    {
      id: "03",
      title: "Career Consultation",
      description: "Receive expert advice to navigate your career path",
      image: "./src/assets/offer-3.jpg",
    },
  ];

  return (
    <section id="service" className="py-50 mr-20 px-4 md:px-8 lg:px-16 ">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 mr-250">
          What We <span className="text-[#F83002]">Offer</span>
        </h2>
        <p className="text-gray-600 mb-12 text-lg  mr-130">
          Explore the Benefits and Services We Provide to Enhance Your Job Search and Career Success
        </p>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img src={offer.image} alt={offer.title} className="w-full h-60 object-cover" />
              <div className="flex items-start gap-4 p-6">
                <span className="text-2xl font-bold text-[#F83002]">{offer.id}</span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{offer.title}</h4>
                  <p className="text-gray-600 text-sm">{offer.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
