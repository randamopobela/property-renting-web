"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const SearchSchema = Yup.object().shape({
    destination: Yup.string().required("Kota destinasi wajib diisi"),
    checkIn: Yup.date().required("Tanggal check-in wajib diisi"),
    checkOut: Yup.date()
        .min(Yup.ref("checkIn"), "Check-out tidak boleh sebelum check-in")
        .required("Tanggal check-out wajib diisi"),
    guests: Yup.number()
        .min(1, "Minimal 1 tamu")
        .required("Jumlah tamu wajib diisi"),
});

export default function HomePage() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    return (
        <main className="min-h-screen bg-linear-to-br from-teal-50 via-cyan-50 to-white">
            {/* Hero */}
            <section className="flex flex-col items-center py-16 px-4 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-4"
                >
                    Temukan Penginapan Favoritmu 🏡
                </motion.h2>
                <p className="text-gray-600 max-w-2xl mb-8">
                    Jelajahi penginapan terbaik dengan harga dinamis sesuai
                    tanggal dan lokasi pilihanmu.
                </p>

                {/* Search Form */}
                <Formik
                    initialValues={{
                        destination: "",
                        checkIn: "",
                        checkOut: "",
                        guests: 1,
                    }}
                    validationSchema={SearchSchema}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <Card className="max-w-5xl bg-white/90 backdrop-blur-md shadow-lg border-0">
                                <CardContent className="flex flex-col md:flex-row items-center gap-4 p-6">
                                    {/* Lokasi */}
                                    <div className="flex items-center gap-2 w-full md:w-1/4">
                                        <MapPin className="text-teal-600" />
                                        <div className="w-full">
                                            <Field
                                                name="destination"
                                                placeholder="Cari destinasi"
                                                as={Input}
                                                className="border-teal-200 focus:border-teal-500"
                                            />
                                            <ErrorMessage
                                                name="destination"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-1/4">
                                        <CalendarDays className="text-teal-600" />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full border border-teal-200 rounded-md p-2 text-left"
                                                >
                                                    {startDate
                                                        ? format(
                                                              startDate,
                                                              "dd MMM yyyy"
                                                          )
                                                        : "Pilih tanggal"}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={(date) => {
                                                        setStartDate(date);
                                                        setFieldValue(
                                                            "checkIn",
                                                            date
                                                        );
                                                    }}
                                                    className="rounded-md border border-teal-200"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <ErrorMessage
                                            name="checkIn"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Check-out */}
                                    <div className="flex items-center gap-2 w-full md:w-1/4">
                                        <CalendarDays className="text-teal-600" />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full border border-teal-200 rounded-md p-2 text-left"
                                                >
                                                    {endDate
                                                        ? format(
                                                              endDate,
                                                              "dd MMM yyyy"
                                                          )
                                                        : "Pilih tanggal"}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={(date) => {
                                                        setEndDate(date);
                                                        setFieldValue(
                                                            "checkOut",
                                                            date
                                                        );
                                                    }}
                                                    className="rounded-md border border-teal-200"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <ErrorMessage
                                            name="checkOut"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Guests */}
                                    <div className="flex items-center gap-2 w-full md:w-1/6">
                                        <Users className="text-teal-600" />
                                        <div className="w-full">
                                            <Field
                                                name="guests"
                                                type="number"
                                                min={1}
                                                as={Input}
                                                className="border-teal-200 focus:border-teal-500"
                                            />
                                            <ErrorMessage
                                                name="guests"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        type="submit"
                                        className="bg-teal-600 hover:bg-teal-700 text-white w-full md:w-auto"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Cari
                                    </Button>
                                </CardContent>
                            </Card>
                        </Form>
                    )}
                </Formik>
            </section>

            {/* Property List */}
            <section className="px-10 py-12">
                <h3 className="text-2xl font-semibold text-teal-700 mb-6">
                    Penginapan Populer di Jakarta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card
                            key={i}
                            className="overflow-hidden border-0 shadow-md hover:shadow-xl transition"
                        >
                            <img
                                src={`https://source.unsplash.com/random/400x300/?hotel,room,${i}`}
                                alt="Property"
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-800 text-base">
                                        Apartemen di Menteng #{i}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                        ★ {4.8}
                                    </span>
                                </div>
                                <p className="text-teal-700 font-semibold text-sm">
                                    Rp {(900000 + i * 50000).toLocaleString()} /
                                    malam
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-teal-700 text-white text-center py-6 mt-12">
                <p className="text-sm">
                    © 2025 StayEase. Semua hak cipta dilindungi.
                </p>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:underline text-teal-200">
                        Tentang Kami
                    </a>
                    <a href="#" className="hover:underline text-teal-200">
                        Kebijakan Privasi
                    </a>
                    <a href="#" className="hover:underline text-teal-200">
                        Kontak
                    </a>
                </div>
            </footer>
        </main>
    );
}
