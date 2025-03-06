---  
author : "Osmond Xin"  
categories : ["sql"]  
date : "2025-03-02 01:09:24"  
description : "Database design should show foreign key dependencies directly and evidently"  
slug : "database-design-should-show-foreign-key-dependencies-directly-and-evidently"  
summary : "Database design should show foreign key dependencies directly and evidently"  
tags : ["sql","article"]  
title : "Database design should show foreign key dependencies directly and evidently"  

---

Today. I learned a lot from a mistake. 

# Mistake: 
when I finished the SQL assignment. I used one column to save the primary key which can come from threes different tables. I thought it was an good design. I used a column called Item_id to record the primary key IDs from the three tables of book, ipad, and laptop. 
The scenario of business is to record the rented items by the loan table. As shown in the figure:

![Image](/images/database-design-should-show-foreign-key-dependencies-directly-and-evidently-1.jpeg)

After communicating with Professor Sundus, I confirmed that this is a very bad design. 
# Reason for the mistake: 

**The business logic is hidden in the structure.** 

The business logic is not reflected in the design of the primary and foreign keys. This design is not elegant and direct enough. 

# Good design: 

To add a item table, which uses three foreign keys link to the three primary keys of the three tables, and then associated with the loan table. As shown in the figure: 
[

![Image](/images/database-design-should-show-foreign-key-dependencies-directly-and-evidently-1.jpeg)





](https://x.com/Osmond_Xin/status/1895718910437036479/photo/2)
What I learned: Show the business logic directly in the database design, don't imply it. Reason for my mistake: I have always thought that the design of the database serves the program, as long as the program can run on the database, I have not thought deeply about what is a good database design. Therefore, the design of the database is only maintained at the level of being able to record. I missed to go deep into the level of clearly showing the logic in the table design.