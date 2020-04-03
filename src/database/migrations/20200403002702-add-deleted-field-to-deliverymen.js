module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymen', 'deleted_at', {
      type: Sequelize.DATE,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('deliverymen', 'deleted_at');
  },
};
