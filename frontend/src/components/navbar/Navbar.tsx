import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">EduVerse</h1>

      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;