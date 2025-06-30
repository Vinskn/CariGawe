DROP TABLE IF EXISTS hasil_tes;
DROP TABLE IF EXISTS tes;
DROP TABLE IF EXISTS materi;
DROP TABLE IF EXISTS review_perusahaan;
DROP TABLE IF EXISTS lamaran;
DROP TABLE IF EXISTS pekerjaan;
DROP TABLE IF EXISTS perusahaan;
DROP TABLE IF EXISTS pengalaman_kerja;
DROP TABLE IF EXISTS pelamar;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role TEXT CHECK (role IN ('pelamar', 'perusahaan', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PELAMAR
CREATE TABLE pelamar (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    job_title VARCHAR(100),
    age INTEGER,
    about TEXT,
    education TEXT, -- Assuming jenjang_pendidikan is a TEXT type for this schema
    email VARCHAR(100),
    phone_number VARCHAR(20),
    city VARCHAR(100),
    provinsi VARCHAR(100),
    linkedin TEXT,
    instagram TEXT,
    github TEXT,
    website TEXT,
    twitter TEXT,
    facebook TEXT
);

-- PENGALAMAN KERJA
CREATE TABLE pengalaman_kerja (
    id SERIAL PRIMARY KEY,
    pelamar_id INTEGER REFERENCES pelamar(id),
    nama_perusahaan VARCHAR(100),
    posisi VARCHAR(100),
    tahun_mulai INTEGER,
    tahun_selesai INTEGER,
    deskripsi TEXT
);

-- PERUSAHAAN
CREATE TABLE perusahaan (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    nama_perusahaan VARCHAR(100),
    deskripsi TEXT,
    alamat TEXT,
    website TEXT
);

-- PEKERJAAN
CREATE TABLE pekerjaan (
    id SERIAL PRIMARY KEY,
    perusahaan_id INTEGER REFERENCES perusahaan(user_id),
    judul VARCHAR(100),
    deskripsi TEXT,
    syarat TEXT,
    lokasi VARCHAR(100),
    kategori TEXT, -- Assuming kategori is a TEXT type for this schema
    tanggal_posting DATE DEFAULT CURRENT_DATE,
    status TEXT,
    deskripsi_singkat TEXT,
    rating SMALLINT,
    salary INTEGER,
    tipe_pekerjaan TEXT,
    syarat_kerja JSONB
);

-- LAMARAN
CREATE TABLE lamaran (
    id SERIAL PRIMARY KEY,
    pelamar_id INTEGER REFERENCES pelamar(user_id),
    pekerjaan_id INTEGER REFERENCES pekerjaan(id),
    tanggal_lamar DATE DEFAULT CURRENT_DATE
);

-- REVIEW PERUSAHAAN
CREATE TABLE review_perusahaan (
    id SERIAL PRIMARY KEY,
    pelamar_id INTEGER REFERENCES pelamar(user_id),
    perusahaan_id INTEGER REFERENCES perusahaan(user_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    tanggal_review DATE DEFAULT CURRENT_DATE
);

-- MATERI
CREATE TABLE materi (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    kategori VARCHAR(50),
    daftar_isi JSONB,
    konten JSONB,
    author VARCHAR(100),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating SMALLINT
);

-- TES
CREATE TABLE tes (
    id SERIAL PRIMARY KEY,
    materi_id INTEGER REFERENCES materi(id),
    pertanyaan TEXT,
    opsi_a TEXT,
    opsi_b TEXT,
    opsi_c TEXT,
    opsi_d TEXT,
    jawaban_benar CHAR(1)
);

-- HASIL TES
CREATE TABLE hasil_tes (
    id SERIAL PRIMARY KEY,
    pelamar_id INTEGER REFERENCES pelamar(user_id),
    materi_id INTEGER REFERENCES materi(id),
    nilai INTEGER,
    tanggal_tes DATE DEFAULT CURRENT_DATE
);

-- Insert Data

-- USERS
INSERT INTO users (id, name, email, password, role, created_at) VALUES 
(1, 'Andi Nugraha', 'andi@example.com', 'pass123', 'pelamar', CURRENT_TIMESTAMP),
(2, 'Budi Santoso', 'budi@example.com', 'pass234', 'pelamar', CURRENT_TIMESTAMP),
(3, 'Clara Wijaya', 'clara@example.com', 'pass345', 'pelamar', CURRENT_TIMESTAMP),
(4, 'Dedi Putra', 'dedi@example.com', 'pass456', 'pelamar', CURRENT_TIMESTAMP),
(5, 'Admin TechCorp', 'admin1@techcorp.com', 'pass567', 'perusahaan', CURRENT_TIMESTAMP),
(6, 'Admin InovasiDigital', 'admin2@inovasidigital.id', 'pass678', 'perusahaan', CURRENT_TIMESTAMP),
(7, 'Admin KreasiMedia', 'admin3@kreasimedia.co.id', 'pass789', 'perusahaan', CURRENT_TIMESTAMP),
(8, 'Admin EduSolusi', 'admin4@edusolusi.id', 'pass890', 'perusahaan', CURRENT_TIMESTAMP),
(9, 'Admin FintekKu', 'admin5@fintekku.id', 'pass901', 'perusahaan', CURRENT_TIMESTAMP),
(10, 'Admin Visi Kreasi', 'admin@visikreasi.com', 'pass_vk123', 'perusahaan', CURRENT_TIMESTAMP),
(11, 'Admin Nusa Analitika', 'admin@nusanalitika.id', 'pass_na123', 'perusahaan', CURRENT_TIMESTAMP),
(12, 'Admin Jaya Daya', 'admin@jayadayateknik.co.id', 'pass_jd123', 'perusahaan', CURRENT_TIMESTAMP),
(13, 'Admin Amanah Finansial', 'admin@amanahfinansial.com', 'pass_af123', 'perusahaan', CURRENT_TIMESTAMP),
(14, 'Admin Infra Teknologi', 'admin@infrateknologi.net', 'pass_it123', 'perusahaan', CURRENT_TIMESTAMP),
(15, 'Admin Bakti Konstruksi', 'admin@baktikonstruksi.com', 'pass_bk123', 'perusahaan', CURRENT_TIMESTAMP),
(16, 'Admin Digital Maju', 'admin@digitalmaju.id', 'pass_dm123', 'perusahaan', CURRENT_TIMESTAMP),
(17, 'Razan Megasatria', 'razanmegasatria@gmail.com', 'pass_kp123', 'perusahaan', CURRENT_TIMESTAMP),
(18, 'Admin Cahaya Energi', 'admin@cahayaenergi.com', 'pass_ce123', 'perusahaan', CURRENT_TIMESTAMP),
(19, 'Admin Manufaktur Presisi', 'admin@presisi-manufaktur.co.id', 'pass_mp123', 'perusahaan', CURRENT_TIMESTAMP);

-- PELAMAR
INSERT INTO pelamar (
    id, user_id, first_name, last_name, job_title, age, about, education,
    email, phone_number, city, provinsi, linkedin, instagram, github,
    website, twitter, facebook
) VALUES
(1, 1, 'Andi', 'Nugraha', 'Frontend Developer', 26, 'Pengembang web dengan 3 tahun pengalaman.', 'S1',
 'andi@example.com', '081234567890', 'Jakarta', 'DKI Jakarta', 'linkedin.com/in/andi', 
 'instagram.com/andi', 'github.com/andinugraha', 'andinugraha.dev', 'twitter.com/andi', 'facebook.com/andi'),

(2, 2, 'Budi', 'Santoso', 'UI/UX Designer', 30, 'Desainer UI/UX dengan minat tinggi pada riset pengguna.', 'S2',
 'budi@example.com', '081987654321', 'Bandung', 'Jawa Barat', 'linkedin.com/in/budi', 
 'instagram.com/budi', 'github.com/budis', 'budisantoso.dev', 'twitter.com/budi', 'facebook.com/budi');

-- PENGALAMAN_KERJA
INSERT INTO pengalaman_kerja (
    pelamar_id, nama_perusahaan, posisi, tahun_mulai, tahun_selesai, deskripsi
) VALUES
(1, 'PT Teknologi Cerdas', 'Junior Frontend Developer', 2020, 2022, 'Membangun antarmuka aplikasi internal perusahaan.'),
(1, 'PT Inovasi Digital', 'Frontend Developer', 2022, 2024, 'Mengembangkan fitur baru dan perbaikan bug di aplikasi e-commerce.'),
(2, 'Agensi Kreatif Maju', 'UI Designer', 2018, 2021, 'Merancang wireframe dan prototipe untuk startup.'),
(2, 'Startup Apps', 'UX Researcher', 2021, 2024, 'Riset pengguna dan pengujian kegunaan untuk aplikasi mobile.');

-- PERUSAHAAN
INSERT INTO perusahaan (user_id, nama_perusahaan, deskripsi, alamat, website) VALUES
(10, 'Studio Visi Kreasi', 'Agensi branding dan desain grafis yang berfokus pada identitas visual merek.', 'Bandung', 'https://visikreasi.com'),
(11, 'Nusa Analitika Solusi', 'Perusahaan konsultan data yang membantu bisnis bertransformasi melalui data.', 'Jakarta', 'https://nusanalitika.id'),
(12, 'Jaya Daya Teknik', 'Kontraktor spesialis instalasi dan maintenance kelistrikan untuk gedung komersial.', 'Surabaya', 'https://jayadayateknik.co.id'),
(13, 'Amanah Finansial Grup', 'Lembaga keuangan yang menyediakan layanan perencanaan keuangan dan investasi.', 'Jakarta', 'https://amanahfinansial.com'),
(14, 'Infra Teknologi Persada', 'Penyedia solusi infrastruktur IT, termasuk cloud, server, dan jaringan.', 'Tangerang', 'https://infrateknologi.net'),
(15, 'Bakti Konstruksi Utama', 'Perusahaan rekayasa sipil dan konstruksi untuk proyek-proyek strategis nasional.', 'Bekasi', 'https://baktikonstruksi.com'),
(16, 'Digital Maju Agency', 'Agensi pemasaran terpadu yang menggabungkan strategi online dan offline.', 'Yogyakarta', 'https://digitalmaju.id'),
(17, 'Platform Koding Pro', 'Bootcamp intensif yang mencetak talenta pemrogram siap kerja.', 'Depok', 'https://kodingpro.id'),
(18, 'Cahaya Energi Terbarukan', 'Perusahaan yang berfokus pada instalasi panel surya dan solusi energi hijau.', 'Bali', 'https://cahayaenergi.com'),
(19, 'Manufaktur Presisi Indonesia', 'Perusahaan manufaktur komponen otomotif dengan teknologi CNC.', 'Karawang', 'https://presisi-manufaktur.co.id');

-- PEKERJAAN
INSERT INTO pekerjaan (
  id, perusahaan_id, judul, deskripsi, syarat, lokasi, kategori,
  tanggal_posting, status, deskripsi_singkat, rating, salary, tipe_pekerjaan, syarat_kerja
) VALUES
-- Kategori: Pemrogram
(1, 17, 'Backend Developer (Golang)', 'Mengembangkan microservices yang high-performance untuk platform edukasi kami.', 'Pengalaman dengan Golang, Gin, dan gRPC.', 'Depok', 'Pemrogram', CURRENT_DATE, 'aktif', 'Backend Engineer untuk platform edutech.', 5, 11000000, 'Full-Time', '{"pengalaman": "Minimal 3 tahun", "tools": ["Golang", "Docker", "PostgreSQL"]}'::jsonb),
(2, 14, 'Frontend Developer (Vue.js)', 'Membangun dashboard interaktif untuk klien korporat kami.', 'Menguasai Vue.js, Vuex, dan Nuxt.js.', 'Tangerang', 'Pemrogram', CURRENT_DATE, 'aktif', 'Frontend Engineer untuk produk SaaS B2B.', 4, 10000000, 'Full-Time', '{"pengalaman": "Minimal 2 tahun", "tools": ["Vue.js", "REST API", "TailwindCSS"]}'::jsonb),
(3, 17, 'Full-Stack Developer (Laravel & React)', 'Bekerja pada seluruh siklus produk, dari backend hingga frontend.', 'Mahir dalam PHP Laravel dan React.js.', 'Depok', 'Pemrogram', CURRENT_DATE, 'aktif', 'Full-stack developer untuk tim produk inti.', 5, 12000000, 'Full-Time', '{"tools": ["Laravel", "React", "MySQL"], "kemampuan": ["Problem Solving", "Teamwork"]}'::jsonb),
(4, 11, 'Data Engineer', 'Membangun dan memelihara data pipeline yang scalable dan efisien.', 'Keahlian dalam Python, Apache Spark, dan Airflow.', 'Jakarta', 'Pemrogram', CURRENT_DATE, 'aktif', 'Data Engineer untuk perusahaan konsultan.', 5, 14000000, 'Full-Time', '{"tools": ["Python", "Spark", "AWS"], "pengalaman": "4+ tahun"}'::jsonb),

-- Kategori: Teknologi
(5, 14, 'DevOps Engineer', 'Mengelola CI/CD pipeline, automasi, dan infrastruktur cloud.', 'Pengalaman dengan Kubernetes, Jenkins, dan Terraform.', 'Tangerang', 'Teknologi', CURRENT_DATE, 'aktif', 'DevOps untuk manajemen infrastruktur.', 5, 13000000, 'Full-Time', '{"tools": ["Kubernetes", "CI/CD", "AWS/GCP"], "pengalaman": "3+ tahun"}'::jsonb),
(6, 11, 'IT Support Specialist', 'Memberikan dukungan teknis untuk internal tim dan klien.', 'Memahami troubleshooting hardware, software, dan jaringan.', 'Jakarta', 'Teknologi', CURRENT_DATE, 'aktif', 'Dukungan teknis IT untuk operasional harian.', 4, 6500000, 'Full-Time', '{"kemampuan": ["Komunikasi", "Problem Solving"], "sistem_operasi": ["Windows", "Linux"]}'::jsonb),
(7, 14, 'Cybersecurity Specialist', 'Memantau dan melindungi sistem perusahaan dari ancaman siber.', 'Memiliki sertifikasi seperti CEH atau CompTIA Security+.', 'Tangerang', 'Teknologi', CURRENT_DATE, 'aktif', 'Spesialis keamanan siber untuk aset digital.', 5, 15000000, 'Full-Time', '{"sertifikasi": ["CEH", "CISSP"], "pengalaman": "3 tahun"}'::jsonb),

-- Kategori: Desain
(8, 10, 'Graphic Designer', 'Membuat aset visual untuk kampanye digital, media sosial, dan materi cetak.', 'Sangat mahir dengan Adobe Photoshop, Illustrator.', 'Bandung', 'Desain', CURRENT_DATE, 'aktif', 'Desainer grafis untuk agensi branding.', 4, 7000000, 'Full-Time', '{"pengalaman": "Minimal 2 tahun", "portofolio": "Wajib"}'::jsonb),
(9, 16, 'UI/UX Designer', 'Merancang wireframe, prototipe, dan antarmuka aplikasi klien.', 'Pengalaman mendalam dengan Figma dan metodologi riset pengguna.', 'Yogyakarta', 'Desain', CURRENT_DATE, 'aktif', 'UI/UX Designer untuk agensi digital.', 5, 9000000, 'Full-Time', '{"tools": ["Figma", "Maze"], "kemampuan": ["User Research", "Prototyping"]}'::jsonb),
(10, 10, 'Motion Graphic Designer', 'Membuat animasi dan konten video untuk kebutuhan promosi.', 'Menguasai Adobe After Effects dan Premiere Pro.', 'Bandung', 'Desain', CURRENT_DATE, 'aktif', 'Animator untuk konten media sosial.', 4, 8500000, 'Freelance', '{"tools": ["After Effects", "Premiere Pro"], "portofolio": "Wajib"}'::jsonb),

-- Kategori: Analis
(11, 11, 'Data Analyst', 'Menganalisis set data besar untuk menemukan tren dan memberikan insight bisnis.', 'Keahlian tinggi dalam SQL, Python (Pandas), dan Tableau.', 'Jakarta', 'Analis', CURRENT_DATE, 'aktif', 'Analis data untuk pengambilan keputusan.', 5, 10000000, 'Full-Time', '{"tools": ["SQL", "Tableau", "Python"], "pendidikan": "S1 Statistik/Informatika"}'::jsonb),
(12, 13, 'Financial Analyst', 'Melakukan analisis kesehatan keuangan perusahaan dan kelayakan investasi.', 'Memahami laporan keuangan, valuasi, dan pemodelan finansial.', 'Jakarta', 'Analis', CURRENT_DATE, 'aktif', 'Analis keuangan untuk lembaga investasi.', 4, 11500000, 'Full-Time', '{"kemampuan": ["Financial Modeling", "Valuasi"], "pengalaman": "3 tahun"}'::jsonb),
(13, 16, 'Marketing Analyst', 'Menganalisis efektivitas kampanye pemasaran dan perilaku konsumen.', 'Berpengalaman dengan Google Analytics dan tools analisis media sosial.', 'Yogyakarta', 'Analis', CURRENT_DATE, 'aktif', 'Analis untuk mengukur ROI pemasaran.', 4, 8000000, 'Full-Time', '{"tools": ["Google Analytics", "SEMRush", "Excel"], "pengalaman": "2 tahun"}'::jsonb),

-- Kategori: Pemasaran
(14, 16, 'Digital Marketing Strategist', 'Merancang dan mengeksekusi strategi pemasaran digital end-to-end.', 'Menguasai SEO, SEM, Content Marketing, dan Email Marketing.', 'Yogyakarta', 'Pemasaran', CURRENT_DATE, 'aktif', 'Ahli strategi pemasaran digital.', 5, 9500000, 'Full-Time', '{"platform": ["Google Ads", "Meta Ads", "SEO"], "pengalaman": "3+ tahun"}'::jsonb),
(15, 10, 'Social Media Specialist', 'Mengelola semua akun media sosial, membuat konten, dan berinteraksi dengan audiens.', 'Kreatif dan memahami tren media sosial terkini.', 'Bandung', 'Pemasaran', CURRENT_DATE, 'aktif', 'Spesialis media sosial untuk agensi.', 4, 6000000, 'Full-Time', '{"platform": ["Instagram", "TikTok", "LinkedIn"], "kemampuan": ["Copywriting", "Content Creation"]}'::jsonb),
(16, 17, 'Content Writer (Tech)', 'Menulis artikel blog, studi kasus, dan materi edukasi seputar teknologi dan pemrograman.', 'Memiliki kemampuan menulis yang baik dan pemahaman teknis.', 'Depok', 'Pemasaran', CURRENT_DATE, 'aktif', 'Penulis konten untuk bootcamp koding.', 4, 6800000, 'Part-Time', '{"kemampuan": ["Menulis Teknis", "SEO"], "portofolio": "Wajib"}'::jsonb),

-- Kategori: Keuangan
(17, 13, 'Accounting Staff', 'Bertanggung jawab atas pembukuan harian, jurnal, dan laporan keuangan bulanan.', 'Pendidikan D3/S1 Akuntansi, teliti, dan jujur.', 'Jakarta', 'Keuangan', CURRENT_DATE, 'aktif', 'Staf akuntansi untuk operasional harian.', 3, 6500000, 'Full-Time', '{"software": ["Accurate", "Excel"], "pengalaman": "Fresh Graduate dipersilakan"}'::jsonb),
(18, 19, 'Finance Manager', 'Mengawasi semua aspek keuangan perusahaan, termasuk budgeting dan cash flow.', 'Pengalaman manajerial di bidang keuangan minimal 5 tahun.', 'Karawang', 'Keuangan', CURRENT_DATE, 'aktif', 'Manajer keuangan untuk perusahaan manufaktur.', 5, 18000000, 'Full-Time', '{"kemampuan": ["Budgeting", "Financial Reporting", "Leadership"], "pengalaman": "5+ tahun"}'::jsonb),
(19, 13, 'Investment Associate', 'Membantu dalam riset, analisis, dan due diligence untuk peluang investasi baru.', 'Latar belakang di keuangan, perbankan investasi, atau modal ventura.', 'Jakarta', 'Keuangan', CURRENT_DATE, 'aktif', 'Associate untuk tim investasi.', 4, 12500000, 'Full-Time', '{"pendidikan": "S1/S2 Keuangan/Ekonomi", "kemampuan": ["Analisis Investasi"]}'::jsonb),

-- Kategori: Teknik
(20, 15, 'Civil Engineer (Site Manager)', 'Memimpin dan mengelola seluruh kegiatan proyek konstruksi di lapangan.', 'S1 Teknik Sipil, memiliki SKA, dan pengalaman sebagai manajer situs.', 'Bekasi', 'Teknik', CURRENT_DATE, 'aktif', 'Manajer lapangan untuk proyek infrastruktur.', 5, 16000000, 'Full-Time', '{"sertifikasi": "SKA Madya Manajemen Proyek", "pengalaman": "5+ tahun"}'::jsonb),
(21, 19, 'Mechanical Engineer', 'Merancang dan meningkatkan komponen mekanik untuk mesin produksi.', 'Menguasai software desain seperti SolidWorks atau AutoCAD.', 'Karawang', 'Teknik', CURRENT_DATE, 'aktif', 'Insinyur mekanik untuk manufaktur.', 4, 9000000, 'Full-Time', '{"tools": ["SolidWorks", "AutoCAD"], "pengalaman": "Minimal 2 tahun"}'::jsonb),
(22, 15, 'Quantity Surveyor', 'Menghitung volume pekerjaan dan membuat Rencana Anggaran Biaya (RAB) proyek.', 'D3/S1 Teknik Sipil, teliti dalam perhitungan dan estimasi biaya.', 'Bekasi', 'Teknik', CURRENT_DATE, 'aktif', 'Estimator biaya untuk proyek konstruksi.', 4, 8500000, 'Full-Time', '{"kemampuan": ["Estimasi Biaya", "Manajemen Kontrak"], "pengalaman": "2 tahun"}'::jsonb),
(23, 19, 'CNC Programmer/Operator', 'Membuat program dan mengoperasikan mesin CNC untuk produksi presisi.', 'Pengalaman sebagai operator dan programmer mesin CNC Fanuc/Siemens.', 'Karawang', 'Teknik', CURRENT_DATE, 'aktif', 'Operator mesin produksi CNC.', 4, 7200000, 'Full-Time', '{"pengalaman": "2 tahun", "shift": "Bersedia kerja shift"}'::jsonb),

-- Kategori: Teknisi Listrik
(24, 12, 'Teknisi Listrik Gedung', 'Melakukan instalasi, perawatan, dan perbaikan sistem kelistrikan di gedung komersial.', 'Memahami instalasi arus kuat dan arus lemah.', 'Surabaya', 'Teknisi Listrik', CURRENT_DATE, 'aktif', 'Teknisi listrik untuk maintenance gedung.', 4, 6800000, 'Full-Time', '{"kemampuan": ["Panel Listrik", "Instalasi", "Troubleshooting"], "pengalaman": "Minimal 2 tahun"}'::jsonb),
(25, 18, 'Teknisi Panel Surya', 'Melakukan pemasangan dan commissioning instalasi panel surya di lokasi klien.', 'Memiliki pengalaman di bidang energi terbarukan lebih disukai.', 'Bali', 'Teknisi Listrik', CURRENT_DATE, 'aktif', 'Instalatir panel surya residensial.', 4, 7500000, 'Full-Time', '{"pengalaman": "1 tahun", "keselamatan": "Memahami K3"}'::jsonb),
(26, 12, 'Electrical Drafter', 'Menggambar diagram kelistrikan dan single line diagram menggunakan AutoCAD.', 'Mahir menggunakan AutoCAD Electrical.', 'Surabaya', 'Teknisi Listrik', CURRENT_DATE, 'aktif', 'Drafter untuk proyek kelistrikan.', 3, 6000000, 'Full-Time', '{"tools": ["AutoCAD Electrical"], "pengalaman": "Fresh Graduate dipersilakan"}'::jsonb),
(27, 15, 'Quality Control (QC) Inspector', 'Memastikan kualitas pekerjaan konstruksi sesuai dengan standar dan spesifikasi.', 'Berpengalaman sebagai QC di proyek konstruksi.', 'Bekasi', 'Teknik', CURRENT_DATE, 'aktif', 'Inspektur kualitas untuk proyek konstruksi.', 4, 8000000, 'Full-Time', '{"kemampuan": ["Quality Assurance", "Pelaporan"], "pengalaman": "3 tahun"}'::jsonb),
(28, 18, 'Project Manager (Renewable Energy)', 'Mengelola proyek instalasi panel surya dari awal hingga akhir.', 'Latar belakang teknik dan pengalaman manajemen proyek.', 'Bali', 'Teknik', CURRENT_DATE, 'aktif', 'Manajer Proyek Energi Terbarukan.', 5, 15000000, 'Full-Time', '{"kemampuan": ["Project Management", "Leadership"], "pengalaman": "4 tahun"}'::jsonb);

-- LAMARAN
INSERT INTO lamaran (id, pelamar_id, pekerjaan_id, tanggal_lamar) VALUES 
(1, 1, 1, CURRENT_DATE),
(2, 2, 2, CURRENT_DATE),
(3, 1, 3, CURRENT_DATE);

-- REVIEW PERUSAHAAN
INSERT INTO review_perusahaan (id, pelamar_id, perusahaan_id, rating, komentar) VALUES
(3, 1, 17, 5, 'Proses rekrutmen di Platform Koding Pro sangat profesional. Technical test untuk posisi Frontend sangat relevan dan studi kasusnya menarik. Timnya terlihat solid.'),
(4, 2, 10, 5, 'Lingkungan kerja di Studio Visi Kreasi sangat kreatif dan kolaboratif. Saya sangat terkesan dengan portofolio desain mereka. Suasananya positif dan mendukung pertumbuhan.'),
(5, 1, 14, 4, 'Infra Teknologi Persada adalah perusahaan yang stabil dengan proyek-proyek besar. Wawancara teknisnya cukup mendalam. Secara keseluruhan pengalaman yang baik, hanya saja prosesnya memakan waktu cukup lama.'),
(6, 2, 16, 3, 'Proses rekrutmen di Digital Maju Agency terasa sedikit terburu-buru dan kurang terstruktur. Kompensasi yang ditawarkan juga di bawah ekspektasi saya untuk posisi UI/UX Designer.'),
(7, 1, 11, 4, 'Nusa Analitika Solusi punya tim yang sangat cerdas. Sebagai developer, saya melihat potensi besar untuk bekerja dengan data yang menarik. Proses wawancara berjalan lancar dan komunikatif.'),
(8, 2, 13, 4, 'Untuk sebuah perusahaan finansial, Amanah Finansial Grup ternyata punya fokus yang baik pada pengalaman pengguna di aplikasi mereka. Tim HR sangat ramah selama proses wawancara.'),
(9, 1, 15, 3, 'Melamar untuk posisi IT support internal. Perusahaan Bakti Konstruksi Utama terlihat sangat kokoh di bidangnya, namun budaya kerjanya terasa sangat formal dan tradisional.'),
(10, 2, 17, 5, 'Sangat merekomendasikan Platform Koding Pro. Meskipun saya seorang desainer, saya bisa melihat bagaimana mereka sangat menghargai peran desain dalam pengembangan produk edukasi mereka.');

-- MATERI
INSERT INTO materi (id, judul, deskripsi, kategori, daftar_isi, konten, author, tags, status)
VALUES (
  1,
  'Belajar PHP Dasar untuk Pemula',
  'Panduan lengkap belajar PHP dari definisi, sejarah, cara kerja, hingga membuat file PHP pertama.',
  'Teknologi & Informatika',
  '{
    "1": "Apa itu PHP?",
    "2": "Sejarah PHP",
    "3": "Cara Kerja PHP",
    "4": "Belajar PHP dasar untuk pemula",
    "5": "Cara membuat file PHP sederhana",
    "6": "Kelas Belajar PHP dasar untuk pemula"
  }',
  '{
    "1": "PHP adalah singkatan dari Hypertext Preprocessor, yaitu bahasa pemrograman yang dirancang khusus untuk aplikasi dan pengembangan website. Bahasa pemrograman PHP memungkinkan kita untuk mengelola data yang terhubung dengan database, menjadikan situs web lebih dinamis, serta menjalankan fungsi-fungsi tertentu yang kita butuhkan pada aplikasi.",
    
    "2": "PHP pertama kali dikembangkan oleh Rasmus Lerdorf pada tahun 1994 dan dirilis secara publik pada 8 Juni 1995. Awalnya bernama FI (Form Interpreted), lalu berkembang menjadi PHP/FI dan akhirnya menjadi PHP 3.0 dengan interpreter baru dari perusahaan Zend.",
    
    "3": "Cara kerja PHP adalah sebagai berikut:\\n1. Browser mengirim permintaan HTTP ke server (misalnya file index.php).\\n2. Server mengeksekusi kode PHP dan menghasilkan HTML.\\n3. Server mengirimkan HTML ke browser untuk ditampilkan.",
    
    "4": "Untuk mulai belajar PHP, kita perlu memahami sintaks dasar, penggunaan variabel, operator, pengkondisian, dan fungsi dasar seperti echo dan print.",
    
    "5": "Contoh file PHP sederhana:\\n<?php\\necho ''Hello, World!'';\\n?>",
    
    "6": "Tersedia banyak kelas online dan tutorial interaktif untuk belajar PHP seperti di w3schools, Codecademy, dan dokumentasi resmi php.net."
  }',
  'Admin PHP',
  '{"php", "web", "belajar", "pemula"}',
  'publish'
),
(
  2,
  'Pengenalan Git dan GitHub untuk Pemula',
  'Pelajari dasar-dasar Git untuk mengelola versi kodemu dan cara berkolaborasi menggunakan GitHub.',
  'Teknologi & Informatika',
  '{
    "1": "Apa itu Version Control System?",
    "2": "Mengenal Git",
    "3": "Perintah Dasar Git (init, add, commit, push, pull)",
    "4": "Apa itu GitHub?",
    "5": "Membuat Repository Pertama di GitHub",
    "6": "Studi Kasus: Kolaborasi Sederhana"
  }',
  '{
    "1": "Version Control System (VCS) adalah sistem yang merekam perubahan pada sebuah file atau set file dari waktu ke waktu sehingga Anda dapat kembali ke versi tertentu di kemudian hari. Ini memungkinkan banyak orang untuk bekerja bersama pada proyek yang sama tanpa menimpa pekerjaan satu sama lain.",
    "2": "Git adalah salah satu VCS modern terdistribusi yang paling populer. Git cepat, efisien, dan andal untuk proyek dari skala kecil hingga sangat besar. Diciptakan oleh Linus Torvalds, pencipta Linux.",
    "3": "Beberapa perintah dasar yang wajib diketahui: `git init` untuk memulai repository baru, `git add` untuk menambahkan file ke staging area, `git commit` untuk menyimpan perubahan, `git push` untuk mengirim perubahan ke remote repository, dan `git pull` untuk mengambil perubahan dari remote.",
    "4": "GitHub adalah platform hosting berbasis web untuk repository Git. Ini menyediakan antarmuka grafis dan fitur kolaborasi seperti manajemen tugas, pelacakan bug, dan pull requests.",
    "5": "Untuk membuat repository di GitHub, cukup login, klik tombol ''New'', beri nama repository Anda, pilih antara publik atau privat, dan klik ''Create repository''.",
    "6": "Seorang developer A membuat proyek dan mendorongnya ke GitHub. Developer B melakukan ''clone'' repository, membuat perubahan pada branch baru, lalu membuat ''pull request''. Developer A dapat me-review perubahan tersebut sebelum menggabungkannya ke branch utama. Inilah inti dari kolaborasi menggunakan Git dan GitHub."
  }',
  'Admin Tech',
  '{"git", "github", "vcs", "pemula", "kolaborasi"}',
  'publish'
),
(
  3,
  '5 Tips Sukses Menghadapi Wawancara Kerja',
  'Panduan praktis berisi tips penting mulai dari persiapan hingga tahap follow-up untuk membantumu sukses dalam wawancara kerja.',
  'Pengembangan Diri',
  '{
    "1": "Riset Perusahaan dan Posisi yang Dilamar",
    "2": "Siapkan Jawaban untuk Pertanyaan Umum (Metode STAR)",
    "3": "Latih Bahasa Tubuh yang Profesional",
    "4": "Siapkan Pertanyaan untuk Pewawancara",
    "5": "Pentingnya Mengirim Email Terima Kasih (Follow-up)"
  }',
  '{
    "1": "Sebelum wawancara, pelajari visi, misi, produk, dan berita terbaru tentang perusahaan. Pahami juga tanggung jawab dan kualifikasi dari posisi yang Anda lamar. Ini menunjukkan bahwa Anda serius dan antusias.",
    "2": "Siapkan jawaban untuk pertanyaan seperti ''Ceritakan tentang diri Anda'' atau ''Sebutkan kelemahan Anda''. Gunakan metode STAR (Situation, Task, Action, Result) untuk menjawab pertanyaan berbasis perilaku, misalnya ''Ceritakan pengalaman Anda saat mengatasi konflik''.",
    "3": "Jabat tangan yang erat, pertahankan kontak mata, duduk dengan tegak, dan tunjukkan gestur positif. Bahasa tubuh yang baik mencerminkan kepercayaan diri dan profesionalisme Anda.",
    "4": "Menyiapkan pertanyaan cerdas tentang budaya kerja, tantangan di posisi tersebut, atau ekspektasi 3 bulan pertama menunjukkan bahwa Anda proaktif dan benar-benar tertarik.",
    "5": "Setelah wawancara, kirimkan email ucapan terima kasih kepada pewawancara dalam waktu 24 jam. Ucapkan terima kasih atas waktu mereka, tegaskan kembali minat Anda pada posisi tersebut, dan sebutkan secara singkat satu hal menarik dari diskusi Anda. Ini akan membuat Anda lebih diingat."
  }',
  'Tim HRD Pro',
  '{"wawancara", "karir", "tips", "interview", "pengembangan diri"}',
  'publish'
);

-- TES
INSERT INTO tes (id, materi_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar) VALUES
(1, 1, 'Apa itu PHP?', 'Bahasa markup', 'Bahasa pemrograman', 'Framework', 'Library', 'B'),
(2, 1, 'Siapa pengembang awal PHP?', 'Guido van Rossum', 'Brendan Eich', 'Rasmus Lerdorf', 'James Gosling', 'C'),
(3, 1, 'Apa output dari echo "Hello, world!"?', 'Cetak ke browser', 'Simpan file', 'Kirim ke server', 'Hapus file', 'A');

-- HASIL TES
INSERT INTO hasil_tes (id, pelamar_id, materi_id, nilai) VALUES 
(1, 1, 1, 90),
(2, 2, 1, 85),
(3, 1, 2, 75);

-- Stored Procedure: update_job_status_after_expiration
-- First, ensure 'tanggal_berakhir' column exists in 'pekerjaan' table.
-- If not, add it:
ALTER TABLE pekerjaan
ADD COLUMN IF NOT EXISTS tanggal_berakhir DATE;

-- Optional: Update existing jobs to have a future expiration date if they are 'aktif'
UPDATE pekerjaan
SET tanggal_berakhir = CURRENT_DATE + INTERVAL '30 days'
WHERE status = 'aktif' AND tanggal_berakhir IS NULL;

CREATE OR REPLACE PROCEDURE update_job_status_after_expiration()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE pekerjaan
    SET status = 'expired'
    WHERE status = 'aktif'
      AND tanggal_berakhir IS NOT NULL
      AND tanggal_berakhir < CURRENT_DATE;

    RAISE NOTICE 'Job statuses updated successfully.';
END;
$$;

-- Trigger: update_materi_tanggal_update
CREATE OR REPLACE FUNCTION update_materi_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tanggal_update = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER materi_tanggal_update_trigger
BEFORE UPDATE ON materi
FOR EACH ROW
EXECUTE FUNCTION update_materi_timestamp();

-- Function: get_average_company_rating
CREATE OR REPLACE FUNCTION get_average_company_rating(p_company_user_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating)
    INTO avg_rating
    FROM review_perusahaan
    WHERE perusahaan_id = p_company_user_id;

    RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- View: active_job_listings
CREATE OR REPLACE VIEW active_job_listings AS
SELECT
    p.id AS pekerjaan_id,
    p.judul AS job_title,
    p.deskripsi AS job_description,
    p.lokasi AS job_location,
    p.kategori AS job_category,
    p.salary,
    p.tipe_pekerjaan,
    p.tanggal_posting,
    pr.nama_perusahaan AS company_name,
    pr.alamat AS company_address,
    pr.website AS company_website,
    COALESCE(get_average_company_rating(pr.user_id), 0) AS company_average_rating
FROM
    pekerjaan p
JOIN
    perusahaan pr ON p.perusahaan_id = pr.user_id
WHERE
    p.status = 'aktif';

-- First, create a function that will be executed by the trigger

CREATE OR REPLACE FUNCTION public.create_profile_on_signup()

RETURNS TRIGGER

LANGUAGE plpgsql

SECURITY DEFINER SET search_path = public

AS $$

BEGIN

  -- Check the role of the new user

  IF NEW.role = 'pelamar' THEN

    -- If the role is 'pelamar', insert a new record into the pelamar table

    INSERT INTO public.pelamar (user_id, email, first_name)

    VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.name, ' ', 1)); -- Uses the first part of the full name as first_name

  ELSIF NEW.role = 'perusahaan' THEN

    -- If the role is 'perusahaan', insert a new record into the perusahaan table

    INSERT INTO public.perusahaan (user_id, nama_perusahaan, website)

    VALUES (NEW.id, NEW.name, ''); -- Uses the user's name as the company name by default

  END IF;

  RETURN NEW;

END;

$$;



-- Now, create the trigger that fires AFTER a new user is inserted

CREATE OR REPLACE TRIGGER on_user_created_create_profile

  AFTER INSERT ON public.users

  FOR EACH ROW EXECUTE FUNCTION public.create_profile_on_signup();



