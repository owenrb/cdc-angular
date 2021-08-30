package io.owenrbee.cdc.vo;

public class SummaryVO {

	private long delete;
	private long insert;
	private String table;
	private long update;
	
	public SummaryVO(String table) {
		this.table = table;
	}
	

	/**
	 * @return the delete
	 */
	public long getDelete() {
		return delete;
	}

	/**
	 * @param delete the delete to set
	 */
	public void setDelete(long delete) {
		this.delete = delete;
	}

	/**
	 * @return the insert
	 */
	public long getInsert() {
		return insert;
	}

	/**
	 * @param insert the insert to set
	 */
	public void setInsert(long insert) {
		this.insert = insert;
	}

	/**
	 * @return the table
	 */
	public String getTable() {
		return table;
	}

	/**
	 * @param table the table to set
	 */
	public void setTable(String table) {
		this.table = table;
	}

	/**
	 * @return the update
	 */
	public long getUpdate() {
		return update;
	}

	/**
	 * @param update the update to set
	 */
	public void setUpdate(long update) {
		this.update = update;
	}

}
