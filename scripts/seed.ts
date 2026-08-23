import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Checking and seeding realistic transactions for demo admin...");
  const admin = await prisma.user.findUnique({
    where: { email: "admin@financetracker.dev" },
  });

  if (!admin) {
    console.log("Admin user not found, please login first.");
    return;
  }

  const txCount = await prisma.transaction.count({
    where: { userId: admin.id },
  });

  if (txCount > 0) {
    console.log(`Admin already has ${txCount} transactions.`);
    return;
  }

  const accounts = await prisma.account.findMany({ where: { userId: admin.id } });
  const categories = await prisma.category.findMany({ where: { userId: admin.id } });

  const bca = accounts.find((a) => a.name.includes("BCA")) || accounts[0];
  const cash = accounts.find((a) => a.name.includes("Cash")) || accounts[1] || accounts[0];
  const gopay = accounts.find((a) => a.name.includes("GoPay")) || accounts[2] || accounts[0];

  const catSalary = categories.find((c) => c.name.includes("Gaji")) || categories[0];
  const catFood = categories.find((c) => c.name.includes("Makanan")) || categories[1] || categories[0];
  const catShopping = categories.find((c) => c.name.includes("Belanja")) || categories[2] || categories[0];

  if (bca && catSalary) {
    await prisma.transaction.create({
      data: {
        userId: admin.id,
        accountId: bca.id,
        categoryId: catSalary.id,
        type: "INCOME",
        amount: 15000000,
        date: new Date(Date.now() - 3 * 86400000),
        description: "Gaji Bulanan Tech Lead",
      },
    });
  }

  if (gopay && catFood) {
    await prisma.transaction.create({
      data: {
        userId: admin.id,
        accountId: gopay.id,
        categoryId: catFood.id,
        type: "EXPENSE",
        amount: 45000,
        date: new Date(Date.now() - 2 * 86400000),
        description: "Makan Siang Nasi Padang & Es Teh",
      },
    });
  }

  if (bca && gopay) {
    await prisma.transaction.create({
      data: {
        userId: admin.id,
        accountId: bca.id,
        targetAccountId: gopay.id,
        type: "TRANSFER",
        amount: 250000,
        date: new Date(Date.now() - 86400000),
        description: "Top-up saldo GoPay dari BCA",
      },
    });
  }

  if (cash && catFood) {
    await prisma.transaction.create({
      data: {
        userId: admin.id,
        accountId: cash.id,
        categoryId: catFood.id,
        type: "EXPENSE",
        amount: 28000,
        date: new Date(),
        description: "Kopi Kenangan Mantan Large",
      },
    });
  }

  if (bca && catShopping) {
    await prisma.transaction.create({
      data: {
        userId: admin.id,
        accountId: bca.id,
        categoryId: catShopping.id,
        type: "EXPENSE",
        amount: 235000,
        date: new Date(),
        description: "Belanja Kebutuhan Mingguan di Superindo",
      },
    });
  }

  console.log("Seeded sample transactions successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
