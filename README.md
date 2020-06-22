Trello alike app built with CRA

Normalized data
1. boards
   > { name, members, type }
2. columns
   - column contains boardId
   > { name, boardId }
3. cards
   - card contains columnId
   > { title, members, description, dueDate, columnId }
4. members
   - members contain boardId
   > { name, boardId }

we could have added column inside board, but the problem then is we can't have same column name twice


// tests
1. test is column delete works perfectly