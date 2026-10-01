package com.codeMind.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.codeMind.backend.security.JwtService;

@SpringBootTest(properties = {
		"ENCRYPTION_PASSWORD=test_encryption_password_must_be_long_enough",
		"SALT_VALUE=5c0744940b5c369b5c0744940b5c369b",
		"OPEN_API_KEY=test_openai_key"
})
class BackendApplicationTests {

	@MockitoBean
	private JwtService jwtService;

	@Test
	void contextLoads() {
	}

}
