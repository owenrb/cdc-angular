package io.owenrbee.cdc.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultType;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DOCUMENT ME!
 *
 */
public interface CdcMapper {

	@Select("SELECT t.name, ct.object_id, ct.version, ct.source_object_id, ct.capture_instance "
			+ "FROM cdc.change_tables ct " 
			+ "JOIN sys.tables t ON ct.source_object_id = t.object_id")
	@ResultType(HashMap.class)
	List<Map<String, Object>> getChangeTables();

	@Select("<script>"
			+ "		DECLARE @startDay DATE = #{startDay}"
			+ "		DECLARE @endDay DATE = #{endDay}"
			+ "		DECLARE @lsnTable TABLE(lsn BINARY(10))"
			+ "		"
			+ "		INSERT INTO @lsnTable"
			+ "		SELECT start_lsn FROM cdc.lsn_time_mapping"
			+ "		WHERE tran_end_time BETWEEN @startDay AND DATEADD(DAY, 1, @endDay)"
			+ "		"
			+ "		<foreach item='cdcTable' index='index' collection='cdcTables' open='' separator=' union ' close=''>"
			+ "			SELECT '${cdcTable}' [cdcName], __$operation [operation], count(*) [hits] FROM ${cdcTable} "
			+ "			WHERE  __$start_lsn in (SELECT * FROM @lsnTable)"
			+ "			GROUP BY __$operation"
			+ "		</foreach>"
			+ "</script>")
	@ResultType(HashMap.class)
	List<Map<String, Object>> getAuditSummary(@Param("startDay") Date startDay, @Param("endDay") Date endDay,
			@Param("cdcTables") List<String> cdcTables);
	
	
	@Select(""
			+ "SELECT * "
			+ "FROM cdc.lsn_time_mapping "
			+ "WHERE tran_end_time BETWEEN #{startDay} AND DATEADD(DAY, 1, #{endDay}"
			+ "")
	@ResultType(HashMap.class)
	List<Map<String, Object>> getTimeMappings(@Param("startDay") Date startDay,
					@Param("endDay") Date endDay);

	@Select(""
			+ "SELECT LOWER(t.name) table_name, LOWER(cc.column_name) column_name, cc.column_id, cc.column_type "
			+ "		FROM cdc.captured_columns cc"
			+ "		JOIN cdc.change_tables ct ON cc.object_id = ct.object_id"
			+ "		JOIN sys.tables t ON ct.source_object_id = t.object_id"
			+ "")
	@ResultType(HashMap.class)
	List<Map<String, Object>> getCapturedColumns();

	@Select(""
			+ "SELECT top ${maxRow} * "
			+ "		FROM ${cdcTable} cdc"
			+ "		JOIN cdc.lsn_time_mapping lsn ON cdc.__$start_lsn = lsn.start_lsn "
			+ "		WHERE lsn.tran_end_time BETWEEN #{startDay} AND DATEADD(DAY, 1, #{endDay})"
			+ "		ORDER BY cdc.__$operation desc"
			+ "")
	@ResultType(HashMap.class)
	List<Map<String, Object>> getChangeDetails(@Param("cdcTable") String cdcTable,
					@Param("startDay") Date startDay,
					@Param("endDay") Date endDay,
					@Param("maxRow") int maxRow);

}