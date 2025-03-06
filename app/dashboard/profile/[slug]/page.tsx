import Image from "next/image";
import { createClient } from "@/app/utils/supabase/server";
import RequestForm from "@/app/dashboard/profile/[slug]/request";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";

export default async function Page({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = await params;
    const username = slug;

    const { data: profile, error: error_data } = await supabase
        .from("profiles")
        .select(`
            *,
            addresses (street, city, state, country, pin_code),
            providers (
                description, availability, service_type, social_links,
                certifications, license_number, specialization, experience_years
            )
        `)
        .eq("username", username)
        .single();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (error_data || !profile) {
        return <div className="text-center text-red-500">Error loading profile.</div>;
    }

    return (
        <div className="w-full mx-auto p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-8 p-6">
                <img
                    src={profile.profile_picture}
                    alt={profile.first_name}
                    width={120}
                    height={120}
                    className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-gray-600">@{profile.username}</p>
                    <p className="text-gray-500 text-sm">{profile.email}</p>
                </div>
            </div>

            {/* Professional Info */}
            <div className="mt-6 p-6">
                <h2 className="text-xl font-semibold text-gray-700">Professional Information</h2>
                <p className="mt-2 text-gray-600">{profile.providers?.description}</p>

                <div className="mt-4">
                    <p><strong>Specialization:</strong> {profile.providers?.specialization}</p>
                    <p><strong>Service Type:</strong> {profile.providers?.service_type}</p>
                    <p><strong>Experience:</strong> {profile.providers?.experience_years} years</p>
                    <p><strong>Certifications:</strong> {profile.providers?.certifications}</p>
                    <p><strong>License Number:</strong> {profile.providers?.license_number}</p>
                </div>
            </div>

            {/* Address Section */}
            <div className="mt-4 p-6">
                <h2 className="text-xl font-semibold text-gray-700">Address</h2>
                <p>{profile.addresses?.street}, {profile.addresses?.city}</p>
                <p>{profile.addresses?.state}, {profile.addresses?.country} - {profile.addresses?.pin_code}</p>
            </div>

            {/* Social Links */}
            {profile.providers?.social_links?.length > 0 && (
                <div className="mt-6 p-6">
                    <h2 className="text-xl font-semibold text-gray-700">🔗 Social Links</h2>
                    <ul className="list-disc list-inside">
                        {profile.providers.social_links.map((link: any, index: number) => (
                            <li key={index}>
                                <a href={link.url} className="text-blue-500 hover:underline" target="_blank">
                                    {link.platform}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Request Form (if user is logged in) */}
            {user && (
                <div className="mt-6">
                    <RequestForm provider_id={profile.user_id} client_id={user.id} />
                </div>
            )}
        </div>
    );
}