import pandas as pd
import plotly.express as px
import json

def generate_analytics_and_charts(df: pd.DataFrame):
    """
    Generate key metrics, analytics, and Plotly charts.
    """
    metrics = {}
    charts = {}
    
    def find_col(keywords):
        for col in df.columns:
            for kw in keywords:
                if kw in col.lower(): return col
        return None

    # 1. Total appointments
    metrics['total_appointments'] = int(len(df))
    
    # 2. Status counts
    status_col = find_col(['status', 'state'])
    if status_col:
        status_counts = df[status_col].astype(str).str.lower().value_counts().to_dict()
        metrics['completed_appointments'] = int(status_counts.get('completed', 0) or status_counts.get('done', 0))
        metrics['cancelled_appointments'] = int(status_counts.get('cancelled', 0) or status_counts.get('cancel', 0))
        metrics['no_show_count'] = int(status_counts.get('no_show', 0) or status_counts.get('no-show', 0))
    
    # 3. Busiest weekday and 4. Busiest month
    date_col = find_col(['date'])
    if date_col:
        df['weekday'] = df[date_col].dt.day_name()
        metrics['busiest_weekday'] = df['weekday'].mode()[0] if not df['weekday'].empty else None
        
        df['month'] = df[date_col].dt.month_name()
        metrics['busiest_month'] = df['month'].mode()[0] if not df['month'].empty else None
        
    # 5. Busiest department
    dept_col = find_col(['department', 'dept', 'specialty'])
    if dept_col:
        metrics['busiest_department'] = df[dept_col].mode()[0] if not df[dept_col].empty else None
        
    # 6. Busiest doctor
    doc_col = find_col(['doctor', 'physician', 'provider'])
    if doc_col:
        metrics['busiest_doctor'] = df[doc_col].mode()[0] if not df[doc_col].empty else None
        
    # 8. Average waiting time
    wait_col = find_col(['wait'])
    if wait_col:
        # safely convert to numeric, coercing errors to NaN
        df[wait_col] = pd.to_numeric(df[wait_col], errors='coerce')
        metrics['average_waiting_time'] = float(df[wait_col].mean()) if not df[wait_col].empty else None
        
    # 9. Average consultation duration
    consult_col = find_col(['consult', 'duration'])
    if consult_col:
        df[consult_col] = pd.to_numeric(df[consult_col], errors='coerce')
        metrics['average_consultation_duration'] = float(df[consult_col].mean()) if not df[consult_col].empty else None
        
    # 10. Follow up rate
    follow_col = find_col(['follow'])
    if follow_col:
        follow_up_count = df[df[follow_col].astype(str).str.lower().isin(['true', 'yes', '1', 'y'])].shape[0]
        metrics['follow_up_rate'] = float((follow_up_count / max(metrics['total_appointments'], 1)) * 100)

    # Populate detailed analytics
    analytics = metrics.copy()
    
    # Helper to save chart JSON
    def save_and_return_chart(fig, name):
        chart_json = fig.to_json()
        with open(f"charts/{name}.json", "w") as f:
            f.write(chart_json)
        return json.loads(chart_json)

    # ----- CHARTS -----
    age_col = find_col(['age'])
    if age_col:
        fig_age = px.histogram(df, x=age_col, title="Patient Age Distribution")
        charts['patient_age_distribution'] = save_and_return_chart(fig_age, 'patient_age_distribution')

    gender_col = find_col(['gender', 'sex'])
    if gender_col:
        fig_gender = px.pie(df, names=gender_col, title="Gender Distribution")
        charts['gender_distribution'] = save_and_return_chart(fig_gender, 'gender_distribution')

    rev_col = find_col(['revenue', 'price', 'cost', 'fee'])
    if dept_col and rev_col:
        dept_rev = df.groupby(dept_col)[rev_col].sum().reset_index()
        fig_dept_rev = px.bar(dept_rev, x=dept_col, y=rev_col, title="Department-wise Revenue")
        charts['department_wise_revenue'] = save_and_return_chart(fig_dept_rev, 'department_wise_revenue')

    return metrics, analytics, charts
