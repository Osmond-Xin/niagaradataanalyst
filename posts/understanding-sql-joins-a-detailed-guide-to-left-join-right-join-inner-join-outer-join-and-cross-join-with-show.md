---  
author : "Osmond Xin"  
categories : ["sql"]  
date : "2025-03-04 01:12:12"  
description : "Understanding SQL Joins A Detailed Guide to Left Join, Right Join, Inner Join, Outer Join, and Cross Join with Show"  
slug : "understanding-sql-joins-a-detailed-guide-to-left-join-right-join-inner-join-outer-join-and-cross-join-with-show"  
summary : "SQL window function shorthands with interview-level examples"  
tags : ["sql"]  
title : "Understanding SQL Joins A Detailed Guide to Left Join, Right Join, Inner Join, Outer Join, and Cross Join with Show"  

---

The SQL exam made mistake on join, I figure that I didn’t fully understand left and right joins. I study it and recorded it to prevent mistakes:
left join: all the data in the left table will be show on the results, and the data which is not in the right table is showed as NULL
right join: all the data in the right table will be show on the results, and the data which is not in the left table is showed as NULL
iner join: the data in both tables will be show on the results, and data that is not in one table is not showed
join: same as above
outer join: both tables are showed, and all the data that is not in the table is NULL
cross join: generate the Cartesian product of the data in two tables. tremendous result
![Image](/images/understanding-sql-joins-a-detailed-guide-to-left-join-right-join-inner-join-outer-join-and-cross-join-with-show.png)