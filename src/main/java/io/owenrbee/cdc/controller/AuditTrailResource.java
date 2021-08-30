package io.owenrbee.cdc.controller;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.owenrbee.cdc.bean.CdcBean;
import io.owenrbee.cdc.vo.SummaryVO;

@RestController
@RequestMapping("api/cdc")
public class AuditTrailResource {
	
	private final DateFormat DF = new SimpleDateFormat("yyyy-MM-dd");
	
	@Autowired
	private CdcBean cdcBean;
	
	@GetMapping("columns")
	public List<Map<String, Object>> getCapturedColumns()
	{
		return cdcBean.getCapturedColumns();
	}

	@GetMapping("changeTables")
	public List<Map<String, Object>> getChangeTables()
	{
		return cdcBean.getChangeTables();
	}
	

	@GetMapping("search/{table}")
	public List<Map<String, Object>> getTableUpdates(@PathVariable("table") String table,
		@RequestParam("startDay") String start,
		@RequestParam("endDay") String end,
		@RequestParam("columns") String columns,
		@RequestParam("maxRow") int maxRow)
	{
		Date startDay;
		Date endDay;
		try
		{
			startDay = DF.parse(start);
			endDay = DF.parse(end);
		}
		catch (ParseException e)
		{
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format");
		}

		String cdcTable = "cdc.dbo_" + table + "_CT";

		return cdcBean.getChangeDetails(cdcTable, columns, startDay, endDay, maxRow);
	}


	@GetMapping("search")
	public List<SummaryVO> getUpdates(@RequestParam("startDay") String start,
			@RequestParam("endDay") String end)
	{
		Date startDay;
		Date endDay;
		try
		{
			startDay = DF.parse(start);
			endDay = DF.parse(end);
		}
		catch (ParseException e)
		{
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format");
		}

		Map<String, SummaryVO> map = new HashMap<>();
		List<SummaryVO> result = new ArrayList<>();

		List<Map<String, Object>> captures = cdcBean.getUpdatedInstances(startDay, endDay);
		for (Map<String, Object> capture : captures)
		{
			String cdcName = (String) capture.get("cdcName");
			SummaryVO vo = map.get(cdcName);
			if (vo == null)
			{
				String table = cdcName.replace("cdc.dbo_", "");
				table = table.substring(0, table.length() - 3);

				vo = new SummaryVO(table);
				map.put(cdcName, vo);

				result.add(vo);
			}

			Integer hits = (Integer) capture.get("hits");
			Integer operation = (Integer) capture.get("operation");
			if (operation == 1)
			{
				vo.setDelete(hits);
			}
			else if (operation == 2)
			{
				vo.setInsert(hits);
			}
			else
			{
				vo.setUpdate(hits);
			}
		}

		return result;
	}
}
