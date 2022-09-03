import { User } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default function UsersPage({ users }: PageProps) {
  const router = useRouter();
  const { data, status } = useSession();
  if (status === "loading") {
    return <div>Cargando...</div>;
  }
  if (status === "unauthenticated" || (!data || !(data as UserSession).user.isAdmin)) {
    router.push("/");
    console.log("No eres admin");
    return <div>Redirigiendo...</div>;
  }

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const makeAdmin = async (user: User) => {
    axios.post(`/api/users/${user.id}/admin`).then(refreshData);
  };

  const removeAdmin = async (user: User) => {
    axios.delete(`/api/users/${user.id}/admin`).then(refreshData);
  }

  return (
    <div className="page">
      <h1 className="text-3xl my-2 text-center">Usuarios</h1>
      <table className="table mx-auto">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <button className="btn" onClick={() => { removeAdmin(user) }}>Remover admin</button>
                ) : (
                  <button className="btn" onClick={() => makeAdmin(user)}>Hacer admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PageProps = {
  users: User[]
}


export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const users = await prisma.user.findMany()
  return {
    props: { users },
  }
}
