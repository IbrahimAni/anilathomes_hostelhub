export default function OurMission() {
  return (
    <section className="py-16" data-testid="our-mission">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Our mission is to simplify the student accommodation search process and ensure every student finds a comfortable, safe, and affordable place to call home during their academic journey.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Vision</h3>
                <p className="text-gray-600">To be the leading platform for student accommodation, making the search process seamless and stress-free.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Values</h3>
                <p className="text-gray-600">Trust, transparency, and student satisfaction are at the core of everything we do.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}