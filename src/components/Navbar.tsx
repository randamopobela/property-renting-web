import { Button } from "./ui/button";

export default function NavbarComponent() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md shadow-sm">
            <h1 className="text-2xl font-bold text-teal-700">StayEase</h1>
            <div className="flex items-center gap-5">
                <Button variant="ghost" className="text-teal-700 font-medium">
                    Masuk
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                    Daftar
                </Button>
            </div>
        </nav>
    );
}
