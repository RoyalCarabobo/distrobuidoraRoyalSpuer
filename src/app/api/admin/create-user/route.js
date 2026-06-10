import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, password, fullName, phone, role } = await request.json()

        // 1. Validamos que la llave de servicio exista en el servidor
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "Configuración incompleta: Falta la clave SUPABASE_SERVICE_ROLE_KEY en las variables de entorno." },
                { status: 500 }
            )
        }

        // 2. Inicializamos el cliente maestro aislado de las cookies del navegador
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // 3. Creamos el usuario en Auth (Satisface la clave foránea id_fkey automáticamente)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email.trim(),
            password: password,
            email_confirm: true, // El usuario se crea ya confirmado
            user_metadata: {
                nombre_completo: fullName,
                telefono: phone,
                rol: role,
                status: 'habilitado'
            }
        })

        if (authError) {
            console.error("❌ Error estricto de Supabase Auth:", authError);
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        // 4. Insertamos en tu tabla pública usando el ID real generado en Auth
        const { error: dbError } = await supabaseAdmin
            .from('usuarios')
            .insert([{
                id: authData.user.id,
                correo: email.trim(),
                nombre_completo: fullName,
                telefono: phone,
                rol: role,
                status: 'habilitado',
                fecha_creacion: new Date().toISOString()
            }])

        if (dbError) {
            // Si la inserción en la tabla pública falla, removemos el usuario de Auth para evitar inconsistencias
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            return NextResponse.json({ error: dbError.message }, { status: 400 })
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}