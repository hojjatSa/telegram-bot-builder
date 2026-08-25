/**
 * @fileoverview Тестовые данные шаблона code
 * @module templates/code/code.fixture
 */

/** Узлы с code */
export const nodesWithCode: any[] = [
  {
    id: 'code_1',
    type: 'code',
    position: { x: 0, y: 0 },
    data: {
      code: 'msgs = await client.get_messages(entity, limit=1)\nresult_text = msgs[0].message if msgs else ""',
      autoTransitionTo: 'msg_1',
      enableAutoTransition: true,
    },
  },
  {
    id: 'msg_1',
    type: 'message',
    position: { x: 0, y: 0 },
    data: { messageText: 'Done', buttons: [], keyboardType: 'none' },
  },
];

/** Узлы без code */
export const nodesWithoutCode: any[] = [
  { id: 'msg_1', type: 'message', position: { x: 0, y: 0 }, data: { messageText: 'Hello', buttons: [], keyboardType: 'none' } },
];

/** Код с кавычками и jinja-опасными символами */
export const nodesWithQuotes: any[] = [
  {
    id: 'code_q',
    type: 'code',
    position: { x: 0, y: 0 },
    data: {
      code: 'x = """quoted"""\nresult = 1',
      autoTransitionTo: '',
    },
  },
];
