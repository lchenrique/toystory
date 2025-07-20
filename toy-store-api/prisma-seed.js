// =====================================================
// PRISMA SEED - TOY STORE
// =====================================================

const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // =====================================================
  // CRIAR USUÁRIOS
  // =====================================================
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@toystore.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@toystore.com',
        password: hashedPassword
      }
    }),
    prisma.user.upsert({
      where: { email: 'manager@toystore.com' },
      update: {},
      create: {
        name: 'Manager User',
        email: 'manager@toystore.com',
        password: hashedPassword
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // =====================================================
  // CRIAR CLIENTES
  // =====================================================
  console.log('👤 Creating customers...');
  
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'ana.beatriz@email.com' },
      update: {},
      create: {
        name: 'Ana Beatriz Costa Silva',
        email: 'ana.beatriz@email.com',
        birthDate: new Date('1990-03-15')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'joao.silva@email.com' },
      update: {},
      create: {
        name: 'João Silva',
        email: 'joao.silva@email.com',
        birthDate: new Date('1985-07-22')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'carlos.eduardo@email.com' },
      update: {},
      create: {
        name: 'Carlos Eduardo Figueiredo',
        email: 'carlos.eduardo@email.com',
        birthDate: new Date('1988-12-10')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'maria.santos@email.com' },
      update: {},
      create: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        birthDate: new Date('1992-09-05')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'pedro.henrique@email.com' },
      update: {},
      create: {
        name: 'Pedro Henrique Oliveira Lima',
        email: 'pedro.henrique@email.com',
        birthDate: new Date('1987-11-18')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'fernanda.rodrigues@email.com' },
      update: {},
      create: {
        name: 'Fernanda Rodrigues',
        email: 'fernanda.rodrigues@email.com',
        birthDate: new Date('1991-04-12')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'lucas.mendes@email.com' },
      update: {},
      create: {
        name: 'Lucas Mendes',
        email: 'lucas.mendes@email.com',
        birthDate: new Date('1989-08-25')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'isabela.costa@email.com' },
      update: {},
      create: {
        name: 'Isabela Costa',
        email: 'isabela.costa@email.com',
        birthDate: new Date('1993-01-30')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'rafael.almeida@email.com' },
      update: {},
      create: {
        name: 'Rafael Almeida',
        email: 'rafael.almeida@email.com',
        birthDate: new Date('1986-06-14')
      }
    }),
    prisma.customer.upsert({
      where: { email: 'camila.ferreira@email.com' },
      update: {},
      create: {
        name: 'Camila Ferreira',
        email: 'camila.ferreira@email.com',
        birthDate: new Date('1994-12-03')
      }
    })
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // =====================================================
  // CRIAR VENDAS
  // =====================================================
  console.log('💰 Creating sales...');
  
  const sales = [];
  
  // Vendas para Ana Beatriz (maior volume)
  const anaBeatriz = customers.find(c => c.email === 'ana.beatriz@email.com');
  if (anaBeatriz) {
    sales.push(
      { customerId: anaBeatriz.id, amount: 150.00, date: new Date('2024-01-01') },
      { customerId: anaBeatriz.id, amount: 200.00, date: new Date('2024-01-02') },
      { customerId: anaBeatriz.id, amount: 300.00, date: new Date('2024-01-03') },
      { customerId: anaBeatriz.id, amount: 250.00, date: new Date('2024-01-04') },
      { customerId: anaBeatriz.id, amount: 180.00, date: new Date('2024-01-05') }
    );
  }

  // Vendas para Carlos Eduardo (maior média)
  const carlosEduardo = customers.find(c => c.email === 'carlos.eduardo@email.com');
  if (carlosEduardo) {
    sales.push(
      { customerId: carlosEduardo.id, amount: 500.00, date: new Date('2024-01-01') },
      { customerId: carlosEduardo.id, amount: 450.00, date: new Date('2024-01-02') },
      { customerId: carlosEduardo.id, amount: 600.00, date: new Date('2024-01-03') }
    );
  }

  // Vendas para João Silva (maior frequência)
  const joaoSilva = customers.find(c => c.email === 'joao.silva@email.com');
  if (joaoSilva) {
    sales.push(
      { customerId: joaoSilva.id, amount: 50.00, date: new Date('2024-01-01') },
      { customerId: joaoSilva.id, amount: 75.00, date: new Date('2024-01-02') },
      { customerId: joaoSilva.id, amount: 60.00, date: new Date('2024-01-03') },
      { customerId: joaoSilva.id, amount: 80.00, date: new Date('2024-01-04') },
      { customerId: joaoSilva.id, amount: 65.00, date: new Date('2024-01-05') },
      { customerId: joaoSilva.id, amount: 70.00, date: new Date('2024-01-06') },
      { customerId: joaoSilva.id, amount: 55.00, date: new Date('2024-01-07') }
    );
  }

  // Vendas para Maria Santos
  const mariaSantos = customers.find(c => c.email === 'maria.santos@email.com');
  if (mariaSantos) {
    sales.push(
      { customerId: mariaSantos.id, amount: 120.00, date: new Date('2024-01-01') },
      { customerId: mariaSantos.id, amount: 90.00, date: new Date('2024-01-02') },
      { customerId: mariaSantos.id, amount: 110.00, date: new Date('2024-01-03') }
    );
  }

  // Vendas para Pedro Henrique
  const pedroHenrique = customers.find(c => c.email === 'pedro.henrique@email.com');
  if (pedroHenrique) {
    sales.push(
      { customerId: pedroHenrique.id, amount: 200.00, date: new Date('2024-01-01') },
      { customerId: pedroHenrique.id, amount: 180.00, date: new Date('2024-01-02') },
      { customerId: pedroHenrique.id, amount: 220.00, date: new Date('2024-01-03') },
      { customerId: pedroHenrique.id, amount: 160.00, date: new Date('2024-01-04') }
    );
  }

  // Vendas para outros clientes (demonstrar estatísticas diárias)
  const fernandaRodrigues = customers.find(c => c.email === 'fernanda.rodrigues@email.com');
  if (fernandaRodrigues) {
    sales.push({ customerId: fernandaRodrigues.id, amount: 100.00, date: new Date('2024-01-08') });
  }

  const lucasMendes = customers.find(c => c.email === 'lucas.mendes@email.com');
  if (lucasMendes) {
    sales.push({ customerId: lucasMendes.id, amount: 130.00, date: new Date('2024-01-09') });
  }

  const isabelaCosta = customers.find(c => c.email === 'isabela.costa@email.com');
  if (isabelaCosta) {
    sales.push({ customerId: isabelaCosta.id, amount: 95.00, date: new Date('2024-01-10') });
  }

  const rafaelAlmeida = customers.find(c => c.email === 'rafael.almeida@email.com');
  if (rafaelAlmeida) {
    sales.push({ customerId: rafaelAlmeida.id, amount: 140.00, date: new Date('2024-01-11') });
  }

  const camilaFerreira = customers.find(c => c.email === 'camila.ferreira@email.com');
  if (camilaFerreira) {
    sales.push({ customerId: camilaFerreira.id, amount: 85.00, date: new Date('2024-01-12') });
  }

  // Inserir todas as vendas
  for (const sale of sales) {
    await prisma.sale.create({
      data: sale
    });
  }

  console.log(`✅ Created ${sales.length} sales`);

  // =====================================================
  // VERIFICAÇÃO DOS DADOS
  // =====================================================
  console.log('\n📊 Database Statistics:');
  
  const userCount = await prisma.user.count();
  const customerCount = await prisma.customer.count();
  const saleCount = await prisma.sale.count();
  
  console.log(`👥 Users: ${userCount}`);
  console.log(`👤 Customers: ${customerCount}`);
  console.log(`💰 Sales: ${saleCount}`);

  // Mostrar letras faltantes
  console.log('\n🔤 Missing Letters for each customer:');
  const allCustomers = await prisma.customer.findMany();
  
  for (const customer of allCustomers) {
    const missingLetter = findFirstMissingLetter(customer.name);
    console.log(`  ${customer.name} → Missing: "${missingLetter}"`);
  }

  console.log('\n🎉 Database seed completed successfully!');
}

// Função para encontrar letra faltante (mesma lógica do frontend)
function findFirstMissingLetter(name) {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const lettersInName = new Set(cleanName);
  
  for (let charCode = 97; charCode <= 122; charCode++) {
    const letter = String.fromCharCode(charCode);
    if (!lettersInName.has(letter)) {
      return letter;
    }
  }
  
  return '-';
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 