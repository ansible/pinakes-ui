import orderProcessInfoSchema from './order-process-info.schema';

const createOrderProcessSchema = (intl, id) => ({
  fields: orderProcessInfoSchema(intl, id)
});

export default createOrderProcessSchema;
