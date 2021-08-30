package io.owenrbee.cdc.bean;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.owenrbee.cdc.mapper.CdcMapper;

@Component
public class CdcBean {

	private static final String UPDATE_BEGIN = "UPDATE (B)";
	private static final String UPDATE_END = "UPDATE (E)";
	private static final String DELETE = "DELETE";
	private static final String INSERT = "INSERT";
	
	private final DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	
	@Autowired
	private CdcMapper cdcMapper;
	

	public List<Map<String, Object>> getCapturedColumns()
	{
		return cdcMapper.getCapturedColumns();
	}

	//~ ------------------------------------------

	public List<Map<String, Object>> getChangeDetails(String cdcTable, String columns,
		Date startDay, Date endDay, int maxRow)
	{
		List<String> cols = new ArrayList<>();
		cols.addAll(Arrays.asList(columns.split(",")));

		List<String> lsnColumns = Arrays.asList("start_lsn", "tran_begin_time", "tran_end_time",
				"tran_id", "tran_begin_lsn");

		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

		List<Map<String, Object>> resultSet = cdcMapper.getChangeDetails(cdcTable, startDay,
				endDay, maxRow);

		Map<String, Object> prevRow = null;
		Map<String, Object> prevFilter = null;
		for (Map<String, Object> row : resultSet)
		{
			Map<String, Object> filtered = new LinkedHashMap<>();

			String action = getAction(row);

			Object changedOn = getChangedOn(row);
			
			filtered.put("ACTION", action);
			filtered.put("CHANGED_ON", checkForDate(changedOn));

			for (String _key : row.keySet())
			{
				String key = _key.toLowerCase();
				if (lsnColumns.contains(key) || key.startsWith("__"))
				{ // skip transaction columns
					continue;
				}

				if (cols.contains(key))
				{ // alwasy include row from the config
					filtered.put(key, checkForDate(row.get(_key)));

					continue;
				}

				if (UPDATE_BEGIN.equals(action) && !isEqual(_key, row, prevRow))
				{
					// always report delta
					prevFilter.put(key, checkForDate(prevRow.get(_key)));
					filtered.put(key, checkForDate(row.get(_key)));

					cols.add(key); // include in the next iterations
				}
			}


			result.add(filtered);
			prevFilter = filtered;
			prevRow = row;
		} // end for

		return result;
	}

	//~ ------------------------------------------

	public List<Map<String, Object>> getChangeTables()
	{
		return cdcMapper.getChangeTables();
	}

	//~ ------------------------------------------

	public List<Map<String, Object>> getUpdatedInstances(Date startDay, Date endDay)
	{
		List<String> tableNames = new ArrayList<String>();
		for (Map<String, Object> ct : cdcMapper.getChangeTables())
		{
			String instance = (String) ct.get("capture_instance");
			tableNames.add("cdc." + instance + "_CT");
		}
		;

		return cdcMapper.getAuditSummary(startDay, endDay, tableNames);
	}

	//~ ------------------------------------------

	private Object checkForDate(Object obj)
	{
		if (obj instanceof Date)
		{
			return df.format(obj);
		}

		return obj;
	}

	//~ ------------------------------------------

	private String getAction(Map<String, Object> row)
	{
		Integer op = (Integer) row.get("__$operation");

		switch (op)
		{
			case 1:
			{
				return DELETE;
			}

			case 2:
			{
				return INSERT;
			}

			case 3:
			{
				return UPDATE_BEGIN;
			}

			case 4:
			{
				return UPDATE_END;
			}
		}

		return op.toString();
	}

	//~ ------------------------------------------

	private Object getChangedOn(Map<String, Object> row)
	{
		return row.get("tran_end_time");
	}

	//~ ------------------------------------------

	private boolean isEqual(String key, Map<String, Object> row, Map<String, Object> prevRow)
	{
		if ((row == null) || (prevRow == null))
		{
			return false;
		}

		Object b = row.get(key);
		Object e = prevRow.get(key);

		return (b != null) && b.equals(e);
	}

}
