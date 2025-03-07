---  
author : "Osmond Xin"  
categories : ["sql"]  
date : "2025-03-03 02:19:24"  
description : "SQL window function shorthands with interview-level examples"  
slug : "sql-window-function-shorthands-with-interview-level-examples"  
summary : "SQL window function shorthands with interview-level examples"  
tags : ["sql"]  
title : "SQL window function shorthands with interview-level examples"  

---
To record the shorthand for every SQL window function and an interview-level example.

## Aggregate

### AVG()
**shorthand**：To calculate average of window, ignore NULL

**example**：To find out the percentage difference between the department's employees' salaries and the department's average salary, and identify the employees who more than 20% of the department's average salary.
```sql
SELECT 
    employee_id, 
    department_id, 
    salary,
    AVG(salary) OVER(PARTITION BY department_id) AS dept_avg_salary,
    ROUND((salary - AVG(salary) OVER(PARTITION BY department_id)) / 
          AVG(salary) OVER(PARTITION BY department_id) * 100, 2) AS salary_diff_percentage,
    CASE 
        WHEN salary > AVG(salary) OVER(PARTITION BY department_id) * 1.2 
		THEN 'High-paid employee'
		ELSE 'Ordinary employee'
    END AS salary_category
FROM employees
ORDER BY department_id, salary_diff_percentage DESC;
```

### MAX()
**shorthand**：To return Maximum of window

**example**：To calculate the amount each customer spent in the past three months, and the ratio of this amount to the highest amount spent in their city during the same period.
```sql
WITH monthly_spending AS (
    SELECT 
        customer_id, 
        city,
        DATE_TRUNC('month', order_date) AS month,
        SUM(order_amount) AS monthly_amount
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY customer_id, city, DATE_TRUNC('month', order_date)
)
SELECT 
    ms.customer_id, 
    ms.city, 
    ms.month, 
    ms.monthly_amount,
    MAX(ms.monthly_amount) OVER(PARTITION BY ms.city, ms.month) AS city_max_amount,
    city_max_amount - ms.monthly_amount AS amount_gap,
    ROUND(ms.monthly_amount / city_max_amount * 100, 2) AS percentage_of_max
FROM monthly_spending ms
ORDER BY ms.city, ms.month, percentage_of_max DESC;
```

### MIN()
**shorthand**：To return Minimum of window

**example**：To find the three products in each category which have the smallest price fluctuations over time.
```sql
WITH price_volatility AS (
    SELECT 
        product_id, 
        category_id,
        MAX(price) OVER(PARTITION BY product_id, EXTRACT(YEAR FROM price_date)) 
        MIN(price) OVER(PARTITION BY product_id, EXTRACT(YEAR FROM price_date)) AS yearly_price_range,
        EXTRACT(YEAR FROM price_date) AS price_year
    FROM product_prices
    WHERE price_date >= '2020-01-01'
    GROUP BY product_id, category_id, price_date
),
ranked_products AS (
    SELECT 
        product_id,
        category_id,
        price_year,
        yearly_price_range,
        DENSE_RANK() OVER(PARTITION BY category_id, price_year ORDER BY yearly_price_range) AS price_stability_rank
    FROM price_volatility
)
SELECT 
    rp.product_id,
    p.product_name,
    c.category_name,
    rp.price_year,
    rp.yearly_price_range
FROM ranked_products rp
JOIN products p ON rp.product_id = p.product_id
JOIN categories c ON rp.category_id = c.category_id
WHERE rp.price_stability_rank <= 3
ORDER BY rp.category_id, rp.price_year, rp.yearly_price_range;
```

### SUM()
**shorthand**：To calculate sum of window, ignore NULL

**example**：To analyze the sales of each salesperson to his team, and the minimum number of salespeople required to reach 50% of the team's total sales.
```sql
WITH sales_data AS (
    SELECT 
        s.salesperson_id,
        s.team_id,
        SUM(s.sale_amount) AS total_sales
    FROM sales s
    WHERE s.sale_date BETWEEN '2023-01-01' AND '2023-12-31'
    GROUP BY s.salesperson_id, s.team_id
),
team_analysis AS (
    SELECT 
        sd.salesperson_id,
        sd.team_id,
        sd.total_sales,
        SUM(sd.total_sales) OVER(PARTITION BY sd.team_id) AS team_total_sales,
        sd.total_sales / SUM(sd.total_sales) OVER(PARTITION BY sd.team_id) AS sales_percentage,
        SUM(sd.total_sales) OVER(
            PARTITION BY sd.team_id 
            ORDER BY sd.total_sales DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) / SUM(sd.total_sales) OVER(PARTITION BY sd.team_id) AS cumulative_percentage,
        ROW_NUMBER() OVER(PARTITION BY sd.team_id ORDER BY sd.total_sales DESC) AS sales_rank
    FROM sales_data sd
)
SELECT 
    ta.team_id,
    MIN(ta.sales_rank) AS min_salespeople_for_half_revenue
FROM team_analysis ta
WHERE ta.cumulative_percentage >= 0.5
GROUP BY ta.team_id
ORDER BY ta.team_id;
```

### COUNT()
**shorthand**：To calculate row numbers of window,COUNT(*) include NULL, COUNT(column) ignore NULL

**example**：To find high-value customers who didn't purchase for 3 months or more in the past 6 months.
```sql
WITH monthly_purchases AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', purchase_date) AS purchase_month,
        SUM(purchase_amount) AS monthly_amount
    FROM purchases
    WHERE purchase_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY customer_id, DATE_TRUNC('month', purchase_date)
),
customer_activity AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.customer_value_segment,
        m.purchase_month,
        COALESCE(m.monthly_amount, 0) AS monthly_amount,
        COUNT(m.purchase_month) OVER(
            PARTITION BY c.customer_id 
            ORDER BY m.purchase_month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS months_with_purchases
    FROM customers c
    LEFT JOIN monthly_purchases m ON c.customer_id = m.customer_id
    CROSS JOIN generate_series(
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months'),
        DATE_TRUNC('month', CURRENT_DATE),
        INTERVAL '1 month'
    ) AS calendar_month(month)
    WHERE c.customer_value_segment = 'HIGH'
),
inactive_periods AS (
    SELECT
        customer_id,
        customer_name,
        purchase_month,
        CASE WHEN months_with_purchases = 0 THEN 1 ELSE 0 END AS is_inactive,
        SUM(CASE WHEN months_with_purchases = 0 THEN 1 ELSE 0 END) OVER(
            PARTITION BY customer_id
            ORDER BY purchase_month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS consecutive_inactive_months
    FROM customer_activity
)
SELECT DISTINCT
    customer_id,
    customer_name
FROM inactive_periods
WHERE consecutive_inactive_months >= 3
ORDER BY customer_id;
```

## Ranking

### ROW_NUMBER()
**shorthand**:  To assign unique consecutive integers to each row in the window, and there will be no repeated rankings.

**example**: To find employees in each department whose performance has increased for three consecutive months and calculate their growth rate.
```sql
WITH monthly_performance AS (
    SELECT 
        employee_id,
        department_id,
        DATE_TRUNC('month', performance_date) AS performance_month,
        SUM(performance_score) AS monthly_score
    FROM employee_performance
    WHERE performance_date >= '2023-01-01'
    GROUP BY employee_id, department_id, DATE_TRUNC('month', performance_date)
),
performance_growth AS (
    SELECT 
        mp.employee_id,
        mp.department_id,
        mp.performance_month,
        mp.monthly_score,
        LAG(mp.monthly_score, 1) OVER(
            PARTITION BY mp.employee_id 
            ORDER BY mp.performance_month
        ) AS prev_month_score,
        LAG(mp.monthly_score, 2) OVER(
            PARTITION BY mp.employee_id 
            ORDER BY mp.performance_month
        ) AS prev_prev_month_score,
        ROW_NUMBER() OVER(
            PARTITION BY mp.department_id, EXTRACT(YEAR FROM mp.performance_month) 
            ORDER BY (mp.monthly_score - LAG(mp.monthly_score, 1) OVER(PARTITION BY mp.employee_id ORDER BY mp.performance_month)) DESC
        ) AS growth_rank
    FROM monthly_performance mp
)
SELECT 
    pg.employee_id,
    e.employee_name,
    d.department_name,
    pg.performance_month,
    pg.monthly_score,
    pg.prev_month_score,
    ROUND((pg.monthly_score - pg.prev_month_score) / pg.prev_month_score * 100, 2) AS growth_percentage,
    pg.growth_rank
FROM performance_growth pg
JOIN employees e ON pg.employee_id = e.employee_id
JOIN departments d ON pg.department_id = d.department_id
WHERE 
    pg.monthly_score > pg.prev_month_score AND 
    pg.prev_month_score > pg.prev_prev_month_score AND
    pg.prev_prev_month_score IS NOT NULL
ORDER BY pg.department_id, pg.performance_month, pg.growth_rank;
```

### RANK()
**shorthand**: To assign rankings to rows in the window, the same values ​​getting the same ranking, but with ranking gaps.

**example**: To analyze product sales in each region and find products that rank in the top 5 in each quarter but are not in the top 20 in global sales in the same quarter.
```sql
WITH quarterly_sales AS (
    SELECT 
        p.product_id,
        p.product_name,
        r.region_id,
        r.region_name,
        DATE_TRUNC('quarter', s.sale_date) AS sales_quarter,
        SUM(s.quantity) AS total_quantity
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN stores st ON s.store_id = st.store_id
    JOIN regions r ON st.region_id = r.region_id
    WHERE s.sale_date BETWEEN '2023-01-01' AND '2023-12-31'
    GROUP BY p.product_id, p.product_name, r.region_id, r.region_name, DATE_TRUNC('quarter', s.sale_date)
),
ranked_sales AS (
    SELECT 
        qs.product_id,
        qs.product_name,
        qs.region_id,
        qs.region_name,
        qs.sales_quarter,
        qs.total_quantity,
        RANK() OVER(
            PARTITION BY qs.region_id, qs.sales_quarter 
            ORDER BY qs.total_quantity DESC
        ) AS regional_rank,
        RANK() OVER(
            PARTITION BY qs.sales_quarter 
            ORDER BY qs.total_quantity DESC
        ) AS global_rank
    FROM quarterly_sales qs
)
SELECT 
    rs.product_id,
    rs.product_name,
    rs.region_name,
    rs.sales_quarter,
    rs.total_quantity,
    rs.regional_rank,
    rs.global_rank
FROM ranked_sales rs
WHERE rs.regional_rank <= 5 AND rs.global_rank > 20
ORDER BY rs.region_id, rs.sales_quarter, rs.regional_rank;
```

### DENSE_RANK()
**shorthand**: To assign consecutive ranks to rows in the window, the same values ​​receiving the same rank, but without creating rank gaps.

**example**: To analyze the products in each category that have been in the top three in sales for 3 consecutive months or more in the past year.
```sql
WITH monthly_sales AS (
    SELECT 
        p.product_id,
        p.product_name,
        p.category_id,
        c.category_name,
        DATE_TRUNC('month', s.sale_date) AS sales_month,
        SUM(s.quantity) AS monthly_quantity
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE s.sale_date >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY p.product_id, p.product_name, p.category_id, c.category_name, DATE_TRUNC('month', s.sale_date)
),
ranked_products AS (
    SELECT 
        ms.product_id,
        ms.product_name,
        ms.category_id,
        ms.category_name,
        ms.sales_month,
        ms.monthly_quantity,
        DENSE_RANK() OVER(
            PARTITION BY ms.category_id, ms.sales_month 
            ORDER BY ms.monthly_quantity DESC
        ) AS monthly_rank
    FROM monthly_sales ms
),
consecutive_top_ranks AS (
    SELECT 
        rp.product_id,
        rp.product_name,
        rp.category_id,
        rp.category_name,
        rp.sales_month,
        rp.monthly_rank,
        COUNT(CASE WHEN rp.monthly_rank <= 3 THEN 1 END) OVER(
            PARTITION BY rp.product_id 
            ORDER BY rp.sales_month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS consecutive_top3_months
    FROM ranked_products rp
)
SELECT DISTINCT
    ctr.product_id,
    ctr.product_name,
    ctr.category_name,
    COUNT(ctr.sales_month) AS total_months_in_top3
FROM consecutive_top_ranks ctr
WHERE ctr.consecutive_top3_months = 3
GROUP BY ctr.product_id, ctr.product_name, ctr.category_name
ORDER BY ctr.category_name, total_months_in_top3 DESC;
```

### PERCENT_RANK()
**shorthand**: To calculate the percentage ranking of rows in the window, and return a value from 0 to 1, calculated as (rank-1)/(total_rows-1).

**example**: To analyze the salary distribution of employees in each department and identify employees in different salary tiers.
```sql
WITH salary_distribution AS (
    SELECT 
        e.employee_id,
        e.employee_name,
        e.department_id,
        d.department_name,
        e.salary,
        PERCENT_RANK() OVER(
            PARTITION BY e.department_id 
            ORDER BY e.salary
        ) AS salary_percentile,
        PERCENT_RANK() OVER(
            ORDER BY e.salary
        ) AS overall_percentile
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    WHERE e.status = 'Active'
),
salary_analysis AS (
    SELECT 
        sd.*,
        CASE 
            WHEN sd.salary_percentile < 0.25 THEN 'Low salary group'
            WHEN sd.salary_percentile BETWEEN 0.25 AND 0.75 THEN 'Middle salary group'
            WHEN sd.salary_percentile > 0.75 THEN 'High salary group'
        END AS dept_salary_group,
        CASE 
            WHEN sd.overall_percentile < 0.25 THEN 'Low salary group'
            WHEN sd.overall_percentile BETWEEN 0.25 AND 0.75 THEN 'Middle salary group'
            WHEN sd.overall_percentile > 0.75 THEN 'High salary group'
        END AS company_salary_group
    FROM salary_distribution sd
)
SELECT 
    sa.department_name,
    sa.dept_salary_group,
    sa.company_salary_group,
    COUNT(*) AS employee_count,
    ROUND(AVG(sa.salary), 2) AS avg_salary,
    MIN(sa.salary) AS min_salary,
    MAX(sa.salary) AS max_salary,
    ROUND(STDDEV(sa.salary), 2) AS salary_stddev
FROM salary_analysis sa
GROUP BY sa.department_name, sa.dept_salary_group, sa.company_salary_group
ORDER BY sa.department_name, 
    CASE sa.dept_salary_group 
        WHEN '低薪组' THEN 1 
        WHEN '中薪组' THEN 2 
        WHEN '高薪组' THEN 3 
    END;
```

### NTILE()
**shorthand**: To divide the rows in the window into a specified number of roughly equal groups and return the group number (starting from 1) for each row.

**example**: To divide customers into four levels based on their spending amount and calculate the average customer lifetime value and retention rate for each level.
```sql
WITH customer_spending AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.signup_date,
        c.last_active_date,
        SUM(o.order_amount) AS total_spend,
        COUNT(DISTINCT o.order_id) AS order_count,
        NTILE(4) OVER(
            ORDER BY SUM(o.order_amount) DESC
        ) AS spending_quartile
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY c.customer_id, c.customer_name, c.signup_date, c.last_active_date
),
customer_metrics AS (
    SELECT 
        cs.customer_id,
        cs.customer_name,
        cs.spending_quartile,
        cs.total_spend,
        cs.order_count,
        cs.total_spend / NULLIF(EXTRACT(YEAR FROM AGE(cs.last_active_date, cs.signup_date)), 0) AS yearly_value,
        CASE WHEN cs.last_active_date >= CURRENT_DATE - INTERVAL '3 months' THEN 1 ELSE 0 END AS is_retained
    FROM customer_spending cs
)
SELECT 
    cm.spending_quartile,
    CASE 
		WHEN cm.spending_quartile = 1 THEN 'Platinum Member'
		WHEN cm.spending_quartile = 2 THEN 'Gold Member'
		WHEN cm.spending_quartile = 3 THEN 'Silver Member'
		WHEN cm.spending_quartile = 4 THEN 'Bronze Member'
    END AS customer_tier,
    COUNT(*) AS customer_count,
    ROUND(AVG(cm.total_spend), 2) AS avg_total_spend,
    ROUND(AVG(cm.order_count), 2) AS avg_order_count,
    ROUND(AVG(cm.yearly_value), 2) AS avg_yearly_value,
    ROUND(SUM(cm.is_retained)::DECIMAL / COUNT(*) * 100, 2) AS retention_rate_pct
FROM customer_metrics cm
GROUP BY cm.spending_quartile
ORDER BY cm.spending_quartile;
```

## Value)

### LAG()
**shorthand**: To return the value of the n rows before the current row in the window, often used to calculate the month-on-month change.

**example**: To analyze the sales changes of each product in different quarters, and find products with sales growth rates exceeding 20% ​​for three consecutive quarters.
```sql
WITH quarterly_sales AS (
    SELECT 
        p.product_id,
        p.product_name,
        p.category_id,
        EXTRACT(YEAR FROM s.sale_date) AS sale_year,
        EXTRACT(QUARTER FROM s.sale_date) AS sale_quarter,
        SUM(s.quantity * s.unit_price) AS quarterly_revenue
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    WHERE s.sale_date BETWEEN '2021-01-01' AND '2023-12-31'
    GROUP BY p.product_id, p.product_name, p.category_id, 
             EXTRACT(YEAR FROM s.sale_date), EXTRACT(QUARTER FROM s.sale_date)
),
revenue_growth AS (
    SELECT 
        qs.product_id,
        qs.product_name,
        qs.category_id,
        qs.sale_year,
        qs.sale_quarter,
        qs.quarterly_revenue,
        LAG(qs.quarterly_revenue, 1) OVER(
            PARTITION BY qs.product_id 
            ORDER BY qs.sale_year, qs.sale_quarter
        ) AS prev_quarter_revenue,
        LAG(qs.quarterly_revenue, 2) OVER(
            PARTITION BY qs.product_id 
            ORDER BY qs.sale_year, qs.sale_quarter
        ) AS prev_prev_quarter_revenue,
        CASE 
            WHEN LAG(qs.quarterly_revenue, 1) OVER(PARTITION BY qs.product_id ORDER BY qs.sale_year, qs.sale_quarter) = 0 THEN NULL
            ELSE (qs.quarterly_revenue - LAG(qs.quarterly_revenue, 1) OVER(PARTITION BY qs.product_id ORDER BY qs.sale_year, qs.sale_quarter)) / 
                 LAG(qs.quarterly_revenue, 1) OVER(PARTITION BY qs.product_id ORDER BY qs.sale_year, qs.sale_quarter) * 100
        END AS growth_rate
    FROM quarterly_sales qs
),
consecutive_growth AS (
    SELECT 
        rg.*,
        LAG(rg.growth_rate, 1) OVER(
            PARTITION BY rg.product_id 
            ORDER BY rg.sale_year, rg.sale_quarter
        ) AS prev_growth_rate,
        LAG(rg.growth_rate, 2) OVER(
            PARTITION BY rg.product_id 
            ORDER BY rg.sale_year, rg.sale_quarter
        ) AS prev_prev_growth_rate
    FROM revenue_growth rg
)
SELECT 
    cg.product_id,
    cg.product_name,
    c.category_name,
    CONCAT(cg.sale_year, ' Q', cg.sale_quarter) AS quarter,
    ROUND(cg.quarterly_revenue, 2) AS quarterly_revenue,
    ROUND(cg.growth_rate, 2) AS current_growth_rate_pct,
    ROUND(cg.prev_growth_rate, 2) AS prev_growth_rate_pct,
    ROUND(cg.prev_prev_growth_rate, 2) AS prev_prev_growth_rate_pct
FROM consecutive_growth cg
JOIN categories c ON cg.category_id = c.category_id
WHERE cg.growth_rate > 20 AND cg.prev_growth_rate > 20 AND cg.prev_prev_growth_rate > 20
ORDER BY c.category_name, cg.product_name, cg.sale_year, cg.sale_quarter;
```

### LEAD()
**shorthand**: To return the value of the n rows after the current row in the window, which is used to calculate the year-on-year or year-on-year growth or predict trends.

**example**: To calculate the inventory turnover rate of each product and predict when replenishment is needed at the current sales growth rate.
```sql
WITH daily_inventory AS (
    SELECT 
        product_id,
        inventory_date,
        quantity_on_hand,
        LEAD(inventory_date, 1) OVER(
            PARTITION BY product_id 
            ORDER BY inventory_date
        ) AS next_inventory_date,
        LEAD(quantity_on_hand, 1) OVER(
            PARTITION BY product_id 
            ORDER BY inventory_date
        ) AS next_quantity
    FROM inventory_snapshots
    WHERE inventory_date >= CURRENT_DATE - INTERVAL '90 days'
),
inventory_movement AS (
    SELECT 
        di.product_id,
        di.inventory_date,
        di.quantity_on_hand,
        di.next_inventory_date,
        di.next_quantity,
        di.quantity_on_hand - di.next_quantity AS quantity_sold,
        EXTRACT(DAY FROM (di.next_inventory_date - di.inventory_date)) AS days_between
    FROM daily_inventory di
    WHERE di.next_inventory_date IS NOT NULL
),
turnover_metrics AS (
    SELECT 
        im.product_id,
        p.product_name,
        p.category_id,
        c.category_name,
        p.reorder_level,
        AVG(im.quantity_on_hand) AS avg_inventory,
        SUM(im.quantity_sold) AS total_sold,
        SUM(im.quantity_sold) / NULLIF(AVG(im.quantity_on_hand), 0) AS turnover_ratio,
        SUM(im.quantity_sold) / NULLIF(SUM(im.days_between), 0) AS daily_sales_rate,
        MIN(im.quantity_on_hand) AS min_inventory,
        MAX(im.quantity_on_hand) AS max_inventory
    FROM inventory_movement im
    JOIN products p ON im.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE im.quantity_sold > 0
    GROUP BY im.product_id, p.product_name, p.category_id, c.category_name, p.reorder_level
)
SELECT 
    tm.product_id,
    tm.product_name,
    tm.category_name,
    ROUND(tm.avg_inventory, 2) AS avg_inventory,
    tm.total_sold,
    ROUND(tm.turnover_ratio, 4) AS turnover_ratio,
    ROUND(tm.daily_sales_rate, 2) AS daily_sales_rate,
    tm.min_inventory,
    tm.reorder_level,
    CASE 
        WHEN tm.min_inventory <= tm.reorder_level THEN 'Need to restock immediately'
        WHEN tm.daily_sales_rate > 0 THEN 
            CONCAT('about', ROUND((tm.min_inventory - tm.reorder_level) / tm.daily_sales_rate), 'Need to restock later')
        ELSE 'The sales rate is too low and no replenishment is needed'
    END AS restock_prediction
FROM turnover_metrics tm
ORDER BY 
    CASE WHEN tm.min_inventory <= tm.reorder_level THEN 0 ELSE 1 END,
    (tm.min_inventory - tm.reorder_level) / NULLIF(tm.daily_sales_rate, 0);
```

### FIRST_VALUE()
**shorthand**: To return the value of the first row in the window, usually used to obtain the maximum value or reference benchmark within a group.

**example**: To analyze the monthly sales of each region, calculate the gap with the best sales month in the region and the characteristics of the best month.
```sql
WITH monthly_sales AS (
    SELECT 
        r.region_id,
        r.region_name,
        DATE_TRUNC('month', s.sale_date) AS sale_month,
        COUNT(DISTINCT s.customer_id) AS customer_count,
        COUNT(DISTINCT s.order_id) AS order_count,
        SUM(s.quantity * s.unit_price) AS monthly_revenue,
        AVG(s.quantity * s.unit_price) AS avg_order_value
    FROM sales s
    JOIN stores st ON s.store_id = st.store_id
    JOIN regions r ON st.region_id = r.region_id
    WHERE s.sale_date BETWEEN '2023-01-01' AND '2023-12-31'
    GROUP BY r.region_id, r.region_name, DATE_TRUNC('month', s.sale_date)
),
best_month_analysis AS (
    SELECT 
        ms.*,
        FIRST_VALUE(ms.sale_month) OVER(
            PARTITION BY ms.region_id 
            ORDER BY ms.monthly_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS best_month,
        FIRST_VALUE(ms.monthly_revenue) OVER(
            PARTITION BY ms.region_id 
            ORDER BY ms.monthly_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS best_month_revenue,
        FIRST_VALUE(ms.customer_count) OVER(
            PARTITION BY ms.region_id 
            ORDER BY ms.monthly_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS best_month_customers,
        FIRST_VALUE(ms.order_count) OVER(
            PARTITION BY ms.region_id 
            ORDER BY ms.monthly_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS best_month_orders,
        FIRST_VALUE(ms.avg_order_value) OVER(
            PARTITION BY ms.region_id 
            ORDER BY ms.monthly_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS best_month_aov
    FROM monthly_sales ms
)
SELECT 
    bma.region_name,
    TO_CHAR(bma.sale_month, 'YYYY-MM') AS month,
    TO_CHAR(bma.best_month, 'YYYY-MM') AS best_performing_month,
    ROUND(bma.monthly_revenue, 2) AS monthly_revenue,
    ROUND(bma.best_month_revenue, 2) AS best_month_revenue,
    ROUND((bma.monthly_revenue - bma.best_month_revenue) / bma.best_month_revenue * 100, 2) AS revenue_gap_pct,
    bma.customer_count,
    bma.best_month_customers,
    ROUND((bma.customer_count - bma.best_month_customers) / bma.best_month_customers * 100, 2) AS customer_gap_pct,
    ROUND(bma.avg_order_value, 2) AS avg_order_value,
    ROUND(bma.best_month_aov, 2) AS best_month_aov,
    CASE 
        WHEN (bma.monthly_revenue / bma.best_month_revenue) >= 0.9 THEN 'Close to optimal performance'
        WHEN (bma.monthly_revenue / bma.best_month_revenue) BETWEEN 0.7 AND 0.9 THEN 'Good performance'
        WHEN (bma.monthly_revenue / bma.best_month_revenue) BETWEEN 0.5 AND 0.7 THEN 'Room for improvement'
        ELSE 'Poor performance'
    END AS performance_category
FROM best_month_analysis bma
ORDER BY bma.region_id, bma.sale_month;
```

### LAST_VALUE()
**shorthand**: To return the value of the last row in the window, used to obtain the latest status or end value.

**example**: To analyze the changes in customer purchasing behavior in each quarter, calculate the cumulative consumption of each quarter and compare it with the consumption pattern of the final quarter.
```sql
WITH customer_quarterly_purchases AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.segment,
        EXTRACT(YEAR FROM o.order_date) AS order_year,
        EXTRACT(QUARTER FROM o.order_date) AS order_quarter,
        COUNT(DISTINCT o.order_id) AS quarterly_orders,
        SUM(oi.quantity * oi.unit_price) AS quarterly_spend,
        COUNT(DISTINCT p.category_id) AS categories_purchased
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_date BETWEEN '2022-01-01' AND '2023-12-31'
    GROUP BY c.customer_id, c.customer_name, c.segment, 
             EXTRACT(YEAR FROM o.order_date), EXTRACT(QUARTER FROM o.order_date)
),
customer_trends AS (
    SELECT 
        cqp.*,
        SUM(cqp.quarterly_spend) OVER(
            PARTITION BY cqp.customer_id 
            ORDER BY cqp.order_year, cqp.order_quarter
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulative_spend,
        LAST_VALUE(cqp.quarterly_spend) OVER(
            PARTITION BY cqp.customer_id 
            ORDER BY cqp.order_year, cqp.order_quarter
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS final_quarter_spend,
        LAST_VALUE(cqp.quarterly_orders) OVER(
            PARTITION BY cqp.customer_id 
            ORDER BY cqp.order_year, cqp.order_quarter
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS final_quarter_orders,
        LAST_VALUE(cqp.categories_purchased) OVER(
            PARTITION BY cqp.customer_id 
            ORDER BY cqp.order_year, cqp.order_quarter
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS final_quarter_categories
    FROM customer_quarterly_purchases cqp
)
SELECT 
    ct.customer_id,
    ct.customer_name,
    ct.segment,
    CONCAT(ct.order_year, ' Q', ct.order_quarter) AS quarter,
    ct.quarterly_orders,
    ROUND(ct.quarterly_spend, 2) AS quarterly_spend,
    ct.categories_purchased,
    ROUND(ct.cumulative_spend, 2) AS cumulative_spend,
    ROUND(ct.final_quarter_spend, 2) AS final_quarter_spend,
    ROUND(ct.quarterly_spend / NULLIF(ct.final_quarter_spend, 0) * 100, 2) AS pct_of_final_spend,
	CASE
		WHEN ct.quarterly_spend > ct.final_quarter_spend THEN 'Consumption downtrend'
		WHEN ct.quarterly_spend < ct.final_quarter_spend THEN 'Consumption uptrend'
		ELSE 'Consumption stable'
	END AS spend_trend,
	CASE
		WHEN ct.categories_purchased < ct.final_quarter_categories THEN 'Category diversification increased'
		WHEN ct.categories_purchased > ct.final_quarter_categories THEN 'Category diversification decreased'
		ELSE 'Category diversification stable'
    END AS category_trend
FROM customer_trends ct
ORDER BY ct.customer_id, ct.order_year, ct.order_quarter;
```

### NTH_VALUE()
**shorthand**: To return the value of the row at a specified position within the window, which can be used to obtain the value ranked n.

**example**: To analyze the second best performing product line in each sales region and compare the performance of each region's product with its second best product.

```SQL
WITH product_line_performance AS (
    SELECT 
        r.region_id,
        r.region_name,
        pl.product_line_id,
        pl.product_line_name,
        SUM(s.quantity * s.unit_price) AS total_revenue,
        COUNT(DISTINCT s.order_id) AS order_count,
        COUNT(DISTINCT s.customer_id) AS customer_count,
        AVG(s.quantity * s.unit_price) AS avg_order_value
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    JOIN product_lines pl ON p.product_line_id = pl.product_line_id
    JOIN stores st ON s.store_id = st.store_id
    JOIN regions r ON st.region_id = r.region_id
    WHERE s.sale_date BETWEEN '2023-01-01' AND '2023-12-31'
    GROUP BY r.region_id, r.region_name, pl.product_line_id, pl.product_line_name
),
ranked_performance AS (
    SELECT 
        plp.*,
        RANK() OVER(
            PARTITION BY plp.region_id 
            ORDER BY plp.total_revenue DESC
        ) AS revenue_rank,
        NTH_VALUE(plp.product_line_id, 2) OVER(
            PARTITION BY plp.region_id 
            ORDER BY plp.total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS second_best_product_line_id,
        NTH_VALUE(plp.product_line_name, 2) OVER(
            PARTITION BY plp.region_id 
            ORDER BY plp.total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS second_best_product_line,
        NTH_VALUE(plp.total_revenue, 2) OVER(
            PARTITION BY plp.region_id 
            ORDER BY plp.total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS second_best_revenue,
        NTH_VALUE(plp.customer_count, 2) OVER(
            PARTITION BY plp.region_id 
            ORDER BY plp.total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS second_best_customer_count
    FROM product_line_performance plp
),
comparison_metrics AS (
    SELECT 
        rp.*,
        rp.total_revenue / NULLIF(rp.second_best_revenue, 0) AS revenue_ratio_to_second,
        rp.customer_count / NULLIF(rp.second_best_customer_count, 0) AS customer_ratio_to_second,
        CASE 
            WHEN rp.product_line_id = rp.second_best_product_line_id THEN 1
            ELSE 0
        END AS is_second_best
    FROM ranked_performance rp
)
SELECT 
    cm.region_name,
    cm.product_line_name,
    cm.revenue_rank,
    ROUND(cm.total_revenue, 2) AS total_revenue,
    cm.customer_count,
    cm.second_best_product_line AS benchmark_product_line,
    ROUND(cm.second_best_revenue, 2) AS benchmark_revenue,
    cm.second_best_customer_count AS benchmark_customers,
    ROUND(cm.revenue_ratio_to_second, 2) AS revenue_ratio_to_benchmark,
    ROUND(cm.customer_ratio_to_second, 2) AS customer_ratio_to_benchmark,
    CASE 
	WHEN cm.revenue_rank = 1 THEN CONCAT('Leading the second place', ROUND((cm.revenue_ratio_to_second - 1) * 100, 2), '%')
	WHEN cm.revenue_rank = 2 THEN 'Regional second place (benchmark)'
	WHEN cm.total_revenue >= cm.second_best_revenue * 0.8 THEN 'Close to the second place'
	WHEN cm.total_revenue >= cm.second_best_revenue * 0.5 THEN 'Middle performance'
	ELSE 'Lagged behind'
    END AS performance_category
FROM comparison_metrics cm
ORDER BY cm.region_id, cm.revenue_rank;****
```
