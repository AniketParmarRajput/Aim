export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-black">
      <h1 className="text-4xl font-bold mb-6">About This Project</h1>

      <p className="text-lg leading-relaxed mb-6">
        This full-stack web application is built using modern and scalable technologies
        to deliver fast performance, secure data handling, and a smooth user experience.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        The frontend is developed with <strong>Next.js</strong>, a React-based framework offering
        server-side rendering, optimized performance, reusable components, and an SEO-friendly
        architecture. The UI is built using <strong>Material UI</strong> and <strong>Tailwind CSS</strong>,
        providing a modern design system, utility-first styling, and a responsive, fast, and
        user-friendly experience.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        State management is handled using both the <strong>React Context API</strong> and
        <strong> Redux Toolkit</strong>, enabling efficient global state handling for features such as
        authentication, login state, user sessions, and real-time data updates across the application.
        This ensures consistent data flow and better scalability as the application grows.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Backend: Node.js & Express</h2>
      <p className="text-lg leading-relaxed mb-6">
        The backend uses <strong>Node.js</strong> with <strong>Express.js</strong> to create
        a scalable and secure API layer. It handles RESTful endpoints, authentication,
        authorization, and smooth communication between the client and database.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Database: MySQL</h2>
      <p className="text-lg leading-relaxed mb-6">
        The project uses <strong>MySQL</strong> as the database for structured, secure,
        and efficient data storage. MySQL ensures data integrity and integrates seamlessly
        with the Node.js backend.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p className="text-lg leading-relaxed">
        This project demonstrates how Next.js, Node.js, MySQL, Context API, and Redux Toolkit
        combine to create a fast, secure, and scalable full-stack application. The mission is to provide
        an excellent user experience while maintaining clean, maintainable, and production-ready code.
      </p>
    </div>
  );
}




