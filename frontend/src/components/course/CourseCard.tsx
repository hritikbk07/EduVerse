import Link from "next/link";

const CourseCard = ({ course }: any) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold">{course.title}</h2>
      <p className="text-gray-600">{course.description}</p>
      <p className="font-bold mt-2">₹ {course.price}</p>

      <Link href={`/courses/${course._id}`}>
        <button className="mt-3 bg-black text-white px-4 py-2 rounded">
          View Course
        </button>
      </Link>
    </div>
  );
};

export default CourseCard;