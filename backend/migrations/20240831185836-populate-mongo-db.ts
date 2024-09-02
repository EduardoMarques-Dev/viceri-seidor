module.exports = {
  async up(db, client) {
    const { ObjectId } = require('mongodb'); // Importe no escopo local

    const user1Id = new ObjectId('66d3696fff3431b029486143');
    const user2Id = new ObjectId('66d36983203fe090380a3b6d');
    const task1Id = new ObjectId('66d37eb1f967b0883676d3b3');
    const task2Id = new ObjectId('66d37eb5c1af166344cc78ff');
    const task3Id = new ObjectId('66d3874edbfb01f811b50c93');
    const task4Id = new ObjectId('66d387539a2936a0df87ca24');
    const task5Id = new ObjectId('66d3875876788a7ec92297c8');
    const task6Id = new ObjectId('66d3875d40ccbb5d4d75ae0f');
    //const password = 'U2FsdGVkX18FWrztq6Pz8zJLiUyMKoZTDQ/8nwR5U5M='; // Senha123!
    const password =
      '$2b$10$K3AnM0FVLq9wKdnzZRwX.emLs1H341vZsxbOR.YbWiCEN0fKoGTuq'; // Senha123!

    const usersData = [
      {
        _id: user1Id,
        email: 'admin@viceri.com.br',
        name: 'Yoda',
        password: password,
        roles: ['ADMIN'],
      },
      {
        _id: user2Id,
        email: 'user@viceri.com.br',
        name: 'Luke',
        password: password,
        roles: ['USER'],
      },
    ];

    for (const userData of usersData) {
      await db.collection('test_user').insertOne(userData);
    }

    const tasksData = [
      {
        _id: task1Id,
        user_id: user1Id,
        description: 'Atualizar a agenda do conselho Jedi',
        status: 'PENDENT',
        priority: 'HIGH',
      },
      {
        _id: task2Id,
        user_id: user1Id,
        description: 'Revisar planos intergalácticos',
        status: 'PENDENT',
        priority: 'MEDIUM',
      },
      {
        _id: task3Id,
        user_id: user1Id,
        description: 'Completar a missão secreta nº 42',
        status: 'COMPLETED',
        priority: 'LOW',
      },
      {
        _id: task4Id,
        user_id: user2Id,
        description: 'Treinar habilidades Jedi durante o café',
        status: 'PENDENT',
        priority: 'HIGH',
      },
      {
        _id: task5Id,
        user_id: user2Id,
        description: 'Planejar uma reunião com os Ewoks',
        status: 'PENDENT',
        priority: 'MEDIUM',
      },
      {
        _id: task6Id,
        user_id: user2Id,
        description: 'Recarregar o sabre de luz',
        status: 'COMPLETED',
        priority: 'LOW',
      },
    ];

    for (const taskData of tasksData) {
      await db.collection('test_task').insertOne(taskData);
    }
  },

  async down(db, client) {
    await db.collection('test_user').deleteMany({});
    await db.collection('test_task').deleteMany({});
  },
};
