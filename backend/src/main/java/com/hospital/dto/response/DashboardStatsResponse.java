package com.hospital.dto.response;

public class DashboardStatsResponse {

    private long totalDoctors;
    private long totalPatients;
    private long todayAppointments;
    private long completedAppointments;
    private long pendingAppointments; // BOOKED + CONFIRMED
    private long totalAppointments;
    private long totalDepartments;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalDoctors, long totalPatients, long todayAppointments,
                                  long completedAppointments, long pendingAppointments,
                                  long totalAppointments, long totalDepartments) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.todayAppointments = todayAppointments;
        this.completedAppointments = completedAppointments;
        this.pendingAppointments = pendingAppointments;
        this.totalAppointments = totalAppointments;
        this.totalDepartments = totalDepartments;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTodayAppointments() {
        return todayAppointments;
    }

    public void setTodayAppointments(long todayAppointments) {
        this.todayAppointments = todayAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public long getPendingAppointments() {
        return pendingAppointments;
    }

    public void setPendingAppointments(long pendingAppointments) {
        this.pendingAppointments = pendingAppointments;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }
}
