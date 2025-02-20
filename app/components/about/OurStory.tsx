export default function OurStory() {
  return (
    <section className="py-16 bg-gray-50" data-testid="our-story">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Establishment</h3>
            <p className="text-gray-600">
              Launched in a single state with a focused approach to meet local student housing needs.
            </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Growth</h3>
            <p className="text-gray-600">
              Currently expanding our services to emerging cities, bringing trusted solutions to more students.
            </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Legacy</h3>
            <p className="text-gray-600">
              Building a legacy of reliability and community-focused service as we extend our reach.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}