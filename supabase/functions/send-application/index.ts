import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const resend = new Resend(RESEND_API_KEY)

interface EmailTemplateProps {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  companyName: string;
}

const EmailTemplate = ({ applicantName, applicantEmail, jobTitle, companyName }: EmailTemplateProps) => (
  `<div>
    <h1>Lamaran Pekerjaan Baru untuk Posisi ${jobTitle}</h1>
    <p>Anda telah menerima lamaran pekerjaan baru melalui portal Carigawe.</p>
    <hr />
    <h2>Detail Pelamar:</h2>
    <ul>
      <li><strong>Nama:</strong> ${applicantName}</li>
      <li><strong>Email Kontak:</strong> ${applicantEmail}</li>
    </ul>
    <h2>Posisi yang Dilamar:</h2>
    <ul>
      <li><strong>Perusahaan:</strong> ${companyName}</li>
      <li><strong>Jabatan:</strong> ${jobTitle}</li>
    </ul>
    <hr />
    <p>CV pelamar terlampir dalam email ini.</p>
    <p>Harap segera tindak lanjuti lamaran ini. Terima!</p>
  </div>`
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }
  if (!RESEND_API_KEY) {
    return new Response('Resend API key is not configured.', { status: 500, headers: corsHeaders })
  }

  try {
    const formData = await req.formData()

    const applicantName = formData.get('applicantName');
    if (typeof applicantName !== 'string' || applicantName === null) throw new Error('applicantName is missing or invalid.');

    const applicantEmail = formData.get('applicantEmail');
    if (typeof applicantEmail !== 'string' || applicantEmail === null) throw new Error('applicantEmail is missing or invalid.');

    const cvFile = formData.get('cv');
    if (!(cvFile instanceof File)) throw new Error('CV file is missing or invalid.');
    if (cvFile.size === 0) throw new Error('CV file is empty.');

    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (cvFile.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`CV file size exceeds the limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
    }

    const jobTitle = formData.get('jobTitle');
    if (typeof jobTitle !== 'string' || jobTitle === null) throw new Error('jobTitle is missing or invalid.');

    const companyEmail = formData.get('companyEmail');
    if (typeof companyEmail !== 'string' || companyEmail === null) throw new Error('companyEmail is missing or invalid.');

    const companyName = formData.get('companyName');
    if (typeof companyName !== 'string' || companyName === null) throw new Error('companyName is missing or invalid.');

    console.log(`Received CV file: ${cvFile.name}, Type: ${cvFile.type}, Size: ${cvFile.size} bytes`);

    const cvBuffer = await cvFile.arrayBuffer();
    if (!cvBuffer) throw new Error('Failed to read CV file buffer.');

    console.log('Type of cvBuffer:', typeof cvBuffer);
    console.log('Is cvBuffer an ArrayBuffer instance:', cvBuffer instanceof ArrayBuffer);
    console.log('cvBuffer byte length:', cvBuffer.byteLength);

    // Convert ArrayBuffer to Base64 string for attachment content
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(cvBuffer)));

    const { data, error } = await resend.emails.send({
      from: 'Carigawe <onboarding@resend.dev>',
      to: ['razanmegasatria@gmail.com'], // Temporarily sending to verified email for testing
      subject: `Lamaran Baru: ${applicantName} - ${jobTitle}`,
      html: EmailTemplate({ applicantName, applicantEmail, jobTitle, companyName }),
      attachments: [
        {
          filename: cvFile.name,
          content: base64Content, // Use Base64 encoded content
          contentType: cvFile.type,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ message: error.message || 'An unknown error occurred with Resend.', details: error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (e) {
    console.error("Function general error:", e);
    return new Response(JSON.stringify({ error: e.message || 'An unexpected error occurred in the function.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
