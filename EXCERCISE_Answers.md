# MERN Excercises

## Excercise : mongoDB basics
Page 144

### 1
`db.collection.find().help()`
shows a list of cursor methods

## Exercise : MongoDB CRUD Operations
page 152

### 1 
`db.employee.find({middlename: {$exists:true}})`
returns all Employees with an existing middlename

### 2
No. it's a normal Javascript Object

### 3 
`db.employee.updateOne({_id:ObjectId("xyz")}, {$unset: {middlename:""}})`
removes the middlename for the selected ObjectId (Employee)

### 4 
The one indicate the direction used to iterate through the index. -1 is the opposite direction.

## Excercise : Schema initialization
page 161

### 1
using the mongoDB nodejs library in a nodeJS app, allows for writing everything in a known manner. 

### 2
For a searchbar i would use a text type index. 

## Exercise : Reading from MongoDB
page 164
### 1
using global variable has the advantage that we do not have to care about if the connectino can be reused or if a nre no is needed. 
### 2 
during a predefinite period of time, it tries to reconnect to the db, after that period, an error is shown. 
This Default time can be changed if needed.
### 3
I would limit the number of returned results and work with pagination. .limit(xx)

### Exercise : Writing to MongoDB
page 167

### 1 
???

