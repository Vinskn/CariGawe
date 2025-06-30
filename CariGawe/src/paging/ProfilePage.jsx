import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import { AuthUtils } from '../utils/auth';

function ProfilePelamar() {
const [profile, setProfile] = useState(null);

<h1>hai</h1>

useEffect(() => {
    const fetchProfile = async () => {
    const user = AuthUtils.getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
        .from('pelamar')
        .select('*')
        .eq('email', user.email) // asumsinya email sebagai penghubung login
        .single();

    if (error) {
        console.error("❌ Gagal mengambil data profil:", error);
    } else {
        setProfile(data);
    }
    };

    fetchProfile();
}, []);

if (!profile) return <p className="text-center mt-10 text-gray-500">Memuat profil...</p>;

return (
    <div className="max-w-3xl mx-auto p-8 font-montserrat">
    <h1 className="text-3xl font-bold text-blue7 mb-6">Profil Saya</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div><strong>Nama Depan:</strong> {profile.first_name || '-'}</div>
        <div><strong>Nama Belakang:</strong> {profile.last_name || '-'}</div>
        <div><strong>Email:</strong> {profile.email || '-'}</div>
        <div><strong>No. HP:</strong> {profile.phone_number || '-'}</div>
        <div><strong>Usia:</strong> {profile.age || '-'}</div>
        <div><strong>Kota:</strong> {profile.city || '-'}</div>
        <div><strong>Provinsi:</strong> {profile.provinsi || '-'}</div>
        <div><strong>Pendidikan:</strong> {profile.education || '-'}</div>
        <div className="md:col-span-2">
        <strong>Tentang Saya:</strong>
        <p className="mt-1 text-justify text-gray-700">{profile.about || '-'}</p>
        </div>

        <div className="md:col-span-2 border-t pt-4">
        <h2 className="font-bold text-blue7 mb-2">Sosial Media</h2>
        <ul className="space-y-1 text-blue-600 underline">
            {profile.linkedin && <li><a href={profile.linkedin} target="_blank">LinkedIn</a></li>}
            {profile.instagram && <li><a href={profile.instagram} target="_blank">Instagram</a></li>}
            {profile.github && <li><a href={profile.github} target="_blank">GitHub</a></li>}
            {profile.website && <li><a href={profile.website} target="_blank">Website</a></li>}
            {profile.twitter && <li><a href={profile.twitter} target="_blank">Twitter</a></li>}
            {profile.facebook && <li><a href={profile.facebook} target="_blank">Facebook</a></li>}
            {!profile.linkedin && !profile.instagram && !profile.github &&
            !profile.website && !profile.twitter && !profile.facebook && (
                <li className="text-gray-500">Tidak ada tautan sosial media.</li>
            )}
        </ul>
        </div>
    </div>
    </div>
);
}

export default ProfilePelamar;
