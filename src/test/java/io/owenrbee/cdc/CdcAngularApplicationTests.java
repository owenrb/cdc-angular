package io.owenrbee.cdc;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.Assert;

import io.owenrbee.cdc.mapper.CdcMapper;

@SpringBootTest
class CdcAngularApplicationTests {
	
	@Autowired
	private CdcMapper cdcMapper;

	@Test
	void mapper() {
		
		List<Map<String, Object>> list = cdcMapper.getChangeTables();
		
		Assert.notNull(list, "List must not be null");
		Assert.notEmpty(list, "List must not be empty");
	}

}
