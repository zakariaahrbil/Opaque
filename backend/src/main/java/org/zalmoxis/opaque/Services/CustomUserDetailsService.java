package org.zalmoxis.opaque.Services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zalmoxis.opaque.Entities.User;
import org.zalmoxis.opaque.Repositories.UserRepository;

@Service
public class CustomUserDetailsService
        implements UserDetailsService
{

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {this.userRepository = userRepository;}

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException
    {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));


        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
