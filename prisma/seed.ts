import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const universitiesDataUrl =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

type University = {
  web_pages: string[];
  name: string;
  alpha_two_code: string;
  domains: string[];
  country: string;
};

async function main() {
  await prisma.university.deleteMany({});
  const response = await axios.get<University[]>(universitiesDataUrl);
  for (const university of response.data) {
    await prisma.university.create({
      data: {
        name: university.name,
        country: {
          connectOrCreate: {
            where: {
              name: university.country,
            },
            create: {
              name: university.country,
            },
          },
        },
        domains: university.domains,
        webPages: university.web_pages,
      },
    });
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
