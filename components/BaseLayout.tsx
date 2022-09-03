import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { UserSession } from "~/lib/auth";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  const { data } = useSession()
  const session = data as UserSession

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/">
            <a className="btn btn-ghost normal-case text-xl">
              Home
            </a>
          </Link>
        </div>
        <div className="flex-none gap-2">

          {session ? (
            <>
              {session.user.isAdmin && (
                <>
                  <Link className="btn btn-ghost normal-case" href="/create" >
                    <a>
                      Crear iniciativa
                    </a>
                  </Link>
                  <Link className="btn btn-ghost normal-case" href="/u" >
                    <a>
                      Administrar usuarios
                    </a>
                  </Link>
                </>
              )}
              <button onClick={() => signOut()}>Cerrar sesión</button>
              <Link href={`/u/${session.user.id}`} >
                <a className="avatar w-12">
                  <img src={session.user.image} alt="Tu perfil" />
                </a>
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin" >
              <a>
                Iniciar Sesión
              </a>
            </Link>
          )}
        </div>
      </div>
      <div className="layout">
        {props.children}
      </div>
    </div >
  )
};
